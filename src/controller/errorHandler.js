module.exports = err => {
  let message = '';
  let errors = {firstname: '', lastname: '', username: '', email: '', name: ''};

  if (err.message.includes('Validation failed') || err.message.includes('validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes('11000')) {
    if (err.message.includes('username')) {
      errors.username = 'Username is already in used.';
    }
    if (err.message.includes('email')) {
      errors.email = 'Email is already in used.';
    }
    if (err.message.includes('name')) {
      errors.name = 'Name is already exist';

      if (err.message.includes('products')) {
        errors.name = 'Product Name is already exist';
      }
      if (err.message.includes('inventory')) {
        errors.name = 'Inventory Name is already exist';
      }
      if (err.message.includes('add_ons')) {
        errors.name = 'Add-on Name is already exist';
      }
    }
  }

  if (err.message.length !== 0) {
    message = err.message;
  }

  Object.values(errors).forEach(error => {
    if (error) return (message = error);
  });

  return message;
};
