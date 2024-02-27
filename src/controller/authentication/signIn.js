const response = require('../../utils/response');
const filterObject = require('../../utils/converter/filterObject');
const usersModel = require('../../models/users');
const bcrypt = require('../../lib/bcrypt');
const jwt = require('../../lib/jwt');

const signIn = async (req, res) => {
  const { body } = req;

  const numberPattern = /^\d+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    let resultSignIn = null;

    if (numberPattern.test(body.email)) {
      const [getDataSignIn] = await usersModel.getDataSignInByUsername({ username: body.email });
      resultSignIn = getDataSignIn[0];
    } else if (emailPattern.test(body.email)) {
      const [getDataSignIn] = await usersModel.getDataSignIn({ email: body.email });
      resultSignIn = getDataSignIn[0];
    }

    if (resultSignIn) {
      const passwordMatch = await bcrypt.comparePassword(body.password, resultSignIn.password);

      if (passwordMatch) {

        // const [getUserHasRole] = await userHasRoleModel.getDataDetail(resultSignIn.id_user);

        // const permission = [];

        // if (getUserHasRole?.length > 0) {
        //   getUserHasRole.forEach((item) => {
        //     const createObject = {};
        //     createObject[item.slug] = true;

        //     permission.push({
        //       permission_role: item.slug
        //     });
        //   })
        // }

        // const getSchoolAdmin = await schoolAdministratorModel.getDataByUserId(resultSignIn.id_user);

        // if (getSchoolAdmin?.length > 0) {
        //   const schoolManagement = [];

        //   getSchoolAdmin.forEach((item) => {
        //     schoolManagement.push({
        //       id_school: item.id_school,
        //       name: item.name_school,
        //     });
        //   });

        //   permission.push({
        //     permission_role: 'SCHOOL_ADMINISTRATOR',
        //     schoolManagement,
        //   });
        // }

        // response.defaultResponse({
        //   res,
        //   status: 200,
        //   message: "test result",
        //   data: {
        //     ...filterObject.filter(resultSignIn, [
        //       'id_sub_district',
        //       'password',
        //       'is_delete',
        //     ]),
        //     permission,
        //   },
        // });

        // return;

        const signToken = jwt.signToken({
          ...filterObject.filter(resultSignIn, [
            'id_sub_district',
            'password',
            'is_delete',
          ]),
          // permission,
        });

        response.defaultResponse({
          res,
          status: 200,
          message: "Success login",
          data: { token: `Bearer ${signToken}` },
        });
      } else {
        response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
      }
    } else {
      response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
    }

    // console.log(resultSignIn);

    // response.defaultResponse({
    //   res,
    //   status: 200,
    //   message: "test result",
    //   data: body
    // });

  } catch (error) {
    response.responseErrorServer(res, error);
  }

  // let typeLogin = 'SUPER_ADMIN';

  // if (params.type) typeLogin = params.type;

  // try {
  //   const [getDataSignIn] = await usersModel.getDataSignIn({ email: body.email });
  //   resultSignIn = getDataSignIn[0];

  //   if (resultSignIn) {
  //     const passwordMatch = await bcrypt.comparePassword(body.password, resultSignIn.password);

  //     if (passwordMatch) {
  //       const signToken = jwt.signToken({
  //         ...filterObject.filter(resultSignIn, [
  //           'id_sub_district',
  //           'password',
  //           'is_delete',
  //         ]),
  //       });

  //       response.defaultResponse({
  //         res,
  //         status: 200,
  //         message: "Success login",
  //         data: { token: `Bearer ${signToken}` },
  //       });
  //     } else {
  //       response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
  //     }
  //   } else {
  //     response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
  //   }
  // } catch (error) {
  //   response.responseErrorServer(res, error);
  // }
};

// const signIn = async (req, res) => {
//   const { body, params } = req;
//   let typeLogin = 'SUPER_ADMIN';

//   if (params.type) typeLogin = params.type;

//   try {
//     const [getDataSignIn] = await usersModel.getDataSignIn({ email: body.email });
//     resultSignIn = getDataSignIn[0];

//     if (resultSignIn) {
//       const passwordMatch = await bcrypt.comparePassword(body.password, resultSignIn.password);

//       if (passwordMatch) {
//         const signToken = jwt.signToken({
//           ...filterObject.filter(resultSignIn, [
//             'id_sub_district',
//             'password',
//             'is_delete',
//           ]),
//         });

//         response.defaultResponse({
//           res,
//           status: 200,
//           message: "Success login",
//           data: { token: `Bearer ${signToken}` },
//         });
//       } else {
//         response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
//       }
//     } else {
//       response.defaultResponse({ res, status: 401, message: "Invalid username or password" });
//     }
//   } catch (error) {
//     response.responseErrorServer(res, error);
//   }
// };

module.exports = signIn;
