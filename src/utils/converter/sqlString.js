const convertSelectField = ({ fields, includeFields = [], excludeFields = [] }) => {
  let string = '';

  const filter = fields.filter((item) => !excludeFields.includes(item));
  const fieldsUpdate = [...filter, ...includeFields];

  fieldsUpdate.forEach((item) => {
    string += `${item}, `;
  });

  return `${string.slice(0, -2)}`;
}

const convertCreateField = ({ fields, includeFields = [], excludeFields = [] }) => {
  let string = '';

  const filter = fields.filter((item) => !excludeFields.includes(item));
  const fieldsUpdate = [...filter, ...includeFields];

  fieldsUpdate.forEach((item) => {
    string += `${item}, `;
  });

  return `(${string.slice(0, -2)})`;
};

const convertCreateFieldValue = ({ fields, includeFields = [], excludeFields = [], body }) => {
  let string = '';

  const filter = fields.filter((item) => !excludeFields.includes(item));
  const fieldsUpdate = [...filter, ...includeFields];

  fieldsUpdate.forEach((item) => {
    if (body[item] !== undefined) {
      string += `'${body[item]}', `;
    }
  });

  return `(${string.slice(0, -2)})`;
};

const convertUpdateFieldValue = ({ fields, includeFields = [], excludeFields = [], body }) => {
  let string = '';

  const filter = fields.filter((item) => !excludeFields.includes(item));
  const fieldsUpdate = [...filter, ...includeFields];

  fieldsUpdate.forEach((item) => {
    if (body[item] !== undefined) {
      string += `${item}='${body[item]}', `;
    }
  });

  return `${string.slice(0, -2)}`;
};

module.exports = {
  convertCreateField,
  convertCreateFieldValue,
  convertUpdateFieldValue,
  convertSelectField,
}