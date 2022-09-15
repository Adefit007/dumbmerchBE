const { product, user, category, categoryProduct } = require("../../models");

const cloudinary = require("../utils/cloudinary");

exports.getProducts = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
          through: {
            model: categoryProduct,
            as: "bridge",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE,
      };
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dumbmerch",
      use_filename: true,
      unique_filename: false,
    });

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      image: result.public_id,
      qty: req.body.qty,
      idUser: req.user.id,
    };
    let newProduct = await product.create(data);

    if (categoryId) {
      const categoryProductData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });
      await categoryProduct.bulkCreate(categoryProductData);
    }

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryProduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    res.status(201).send({
      status: "success",
      message: "Add product success",
      data: {
        ...productData,
        image: process.env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryProduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = { ...data, image: process.env.PATH_FILE + data.image };

    res.send({
      status: "success",
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { categoryId } = req.body;
    categoryId = await categoryId.split(",");

    const data = {
      name: req?.body?.name,
      desc: req?.body?.desc,
      price: req?.body?.price,
      image: req?.file?.filename,
      qty: req?.body?.qty,
      idUser: req?.user?.id,
    };

    await categoryProduct.destroy({
      where: { idProduct: id },
    });

    let categoryProductData = [];
    if (categoryId != 0 && category[0] != "") {
      categoryProductData = categoryId.map((item) => {
        return { idProduct: parseInt(id), idCategory: parseInt(item) };
      });
    }

    if (categoryProductData.length != 0) {
      await categoryProduct.bulkCreate(categoryProductData);
    }

    await product.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `product ${id} updated`,
      data: {
        id,
        data,
        categoryProductData,
        image: req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryProduct.destroy({
      where: {
        idProduct: id,
      },
    });

    await product.destroy({
      where: { id },
    });

    res.send({
      status: "success",
      message: `Product ${id} deleted`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
