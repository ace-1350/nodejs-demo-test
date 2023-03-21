module.exports = {
  async up(db, client) {
    const superAdminRole = await db.collection('roles').findOne({role : 'super admin'});
    const superAdmin = {
      fullName: 'Admin',
      lastName: 'System',
      userName: 'admin0001',
      email: 'systemadmin0001@gmail.com',
      password: '456bc8d691b70463b43afe4d6664694c',
      role: superAdminRole._id,
      isDeleted: false,
      deletedBy: null,
      deletedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await db.collection('users').insertOne(superAdmin);
  },

  async down(db, client) {
  }
};
