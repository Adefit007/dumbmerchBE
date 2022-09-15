const { profile, users } = require("../../models");

exports.getProfile = async (req, res) => {
  try {
    const idUser = req.user.id;

    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      image: data ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let { id } = req.params;
    let idUser = req.user.id;

    let data = {
      phone: req?.body?.phone,
      gender: req?.body?.gender,
      address: req?.body?.address,
      image: req?.file?.filename,
    };

    await profile.update(data, {
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    res.send({
      status: "success",
      message: `Update profile id: ${id} finished`,
      data: {
        data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
