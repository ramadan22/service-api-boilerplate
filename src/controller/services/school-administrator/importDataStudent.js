const response = require('../../../utils/response');
const fs = require('fs');
const xlsx = require('xlsx');
const dateFns = require('../../../lib/date-fns');
const bcrypt = require('../../../lib/bcrypt');
const uuid = require('../../../lib/uuid');
const UserModel = require('../../../models/users');
const StudentsModel = require('../../../models/students');
const UHSCModel = require('../../../models/user_has_student_classroom');

const customObjectKey = (obj) => {
  const snakeCaseObj = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === 'Nama Lengkap') {
        snakeCaseObj['fullName'] = obj[key];
      } else if (key === 'L/P') {
        snakeCaseObj['gender'] = obj[key];
      } else if (key === 'Tanggal Lahir') {
        snakeCaseObj['birth_date'] = obj[key];
      } else if (key === 'Nama Ibu Kandung') {
        snakeCaseObj['name_parent'] = obj[key];
      } else if (key === 'NIK Ibu Kandung') {
        snakeCaseObj['nik_parent'] = obj[key];
      } else {
        snakeCaseObj[key.toLowerCase()] = obj[key];
      }
    }
  }

  return snakeCaseObj;
}

const readExelFile = () => {
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync('./public/file/1706194795282-format.xlsx');

      const workbook = xlsx.read(fileContent, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: true });

      const customJsonData = jsonData.map(customObjectKey);

      resolve({ message: 'Success import data exel', data: customJsonData });
    } catch (error) {
      reject(error.message);
    }
  });
}

const generateLastName = (arrayName) => {
  let lastName = '';

  arrayName.forEach((item, idx) => {
    if (idx > 0) {
      lastName += `${item} `;
    }
  });

  return lastName.slice(0, -1);
}

const insertUserFromExel = async (payloads) => {
  const results = await Promise.all(payloads.map(async (item, idx) => {

    try {
      const isExistNISN = await StudentsModel.getExistNISN(item.nisn);

      if (!isExistNISN) {
        const totalUser = await UserModel.getTotalUsers();
        const splitFullName = item.fullName.split(" ");
        const parseBirthDate = dateFns.parse(item.birth_date, 'dd-MM-yyyy', new Date());
        const generateUsername = `${dateFns.format(new Date(), 'yyyy-MM-dd')}${String(totalUser + idx).padStart(4, '0')}`;

        const userData = {
          id_user: uuid.generateId(),
          first_name: splitFullName[0],
          last_name: generateLastName(splitFullName),
          gender: item.gender === 'L' ? 1 : 0,
          birth_date: dateFns.format(parseBirthDate, 'yyyy-MM-dd'),
          password: await bcrypt.encryptPassword(dateFns.format(parseBirthDate, 'yyyy-MM-dd').replace('-', '').replace('-', '')),
          username: generateUsername.replace("-", "").replace("-", ""),
          is_delete: 0,
        };

        await UserModel.createDataWithFileExel(userData);

        return {
          success: true,
          data: {
            ...userData,
            nisn: item.nisn,
            name_parent: item.name_parent,
            nik_parent: item.nik_parent,
          },
        };
      } else {
        throw new Error(`NISN ${item.nisn} already exist !`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }));

  const result_success = results?.filter(result => result?.success)?.map((item) => item?.data);
  const result_failed = results?.filter(result => !result?.success)?.map((item) => item?.error);

  return { result_success, result_failed };
};

const insertStudentFromExel = async (payloads) => {
  const results = await Promise.all(payloads?.map(async (item) => {

    try {
      const id_student = uuid.generateId();

      const studentData = {
        id_student,
        nisn: item.nisn,
        name_parent: item.name_parent,
        nik_parent: item.nik_parent,
        is_delete: 0,
      };

      await StudentsModel.createDataWithFileExel(studentData);

      return {
        success: true,
        data: {
          ...studentData,
          id_user: item.id_user,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }));

  const result_success = results?.filter(result => result?.success)?.map((item) => item?.data);
  const result_failed = results?.filter(result => !result?.success)?.map((item) => item?.error);

  return { result_success, result_failed };
};

const insertUHSCFromExel = async (payloads) => {
  const results = await Promise.all(payloads?.map(async (item) => {

    try {
      // UHSC is user_has_student_classroom
      const UHSCData = {
        id_user_has_student_classroom: uuid.generateId(),
        id_user: item.id_user,
        id_student: item.id_student,
        status: 'NON_AKTIF',
        is_delete: 0,
      };

      await UHSCModel.createData(UHSCData);

      return { success: true, data: UHSCData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }));

  const result_success = results?.filter(result => result?.success)?.map((item) => item?.data);
  const result_failed = results?.filter(result => !result?.success)?.map((item) => item?.error);

  return { result_success, result_failed };
};

const importDataStudent = async (req, res) => {
  const { file } = req;

  const dataFromExel = await readExelFile(file)
    .then(result => {
      return result.data
    }).catch(error => {
      response.responseErrorServer(res, error);
    });

  if (!!dataFromExel && dataFromExel?.length > 0) {
    const result_from_insert_user = await insertUserFromExel(dataFromExel);

    let result_from_insert_student = [];

    // UHSC is user_has_student_classroom
    let result_from_uhsc = [];

    if (!!result_from_insert_user.result_success && result_from_insert_user?.result_success?.length > 0) {
      result_from_insert_student = await insertStudentFromExel(result_from_insert_user?.result_success);
    }

    if (!!result_from_insert_student.result_success && result_from_insert_student?.result_success?.length > 0) {
      result_from_uhsc = await insertUHSCFromExel(result_from_insert_student?.result_success);
    }

    response.defaultResponse({
      res,
      status: 200,
      message: 'Data imported successfully',
      data: {
        result_from_insert_user,
        result_from_insert_student,
        result_from_uhsc,
      },
    });
  }
};

module.exports = importDataStudent;
