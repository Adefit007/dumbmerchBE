const { category, categoryProduct } = require("../../models");

exports.addCategory = async (req, res) => {
  try {
    const newCategory = await category.create(req.body);

    res.send({
      status: "Success",
      message: "Add Category Finished ",
      data: { id: newCategory.id, name: newCategory.name },
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.send({
      status: "success",
      message: "categories",
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

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await category.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
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

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const newCategory = await category.update(req.body, {
      where: { id },
    });
    res.send({
      status: "success",
      message: "data updated",
      data: {
        id: newCategory.id,
        name: newCategory.name,
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

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await category.destroy({
      where: { id },
    });

    await categoryProduct.destroy({
      where: {
        idCategory: id,
      },
    });

    res.send({
      status: "success",
      message: `Category id: ${id} deleted`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addCategoryProduct = async (req, res) => {
  try {
    await categoryProduct.create(req.body);

    res.send({
      status: "success",
      message: "add category product Finished",
      categoryProduct,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
