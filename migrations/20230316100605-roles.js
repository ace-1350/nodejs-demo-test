module.exports = {
  async up(db, client) {
    const roles = [
      {
        role: 'user'
      },
      {
        role: 'admin'
      },
      {
        role: 'super admin'
      }
    ];

    await db.collection('roles').insertMany(roles)
  },

  async down(db, client) {
    db.collection('roles').drop();
  }
};
