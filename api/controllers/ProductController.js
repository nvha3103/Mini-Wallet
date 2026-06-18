module.exports = {
  list: async function (req, res) {
    const products = await Product.find();
    return res.ok(products);
  },

  search: async function (req, res) {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.badRequest({
        message: 'keyword is required'
      });
    }

    const products = await Product.find({
      or: [
        { name: { contains: keyword } },
        { description: { contains: keyword } }
      ]
    });

    return res.ok(products);
  },

  sort: async function (req, res) {
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const allowedSortFields = ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt'];
    const allowedOrders = ['asc', 'desc'];

    if (!allowedSortFields.includes(sortBy)) {
      return res.badRequest({
        message: 'sortBy must be one of: ' + allowedSortFields.join(', ')
      });
    }

    if (!allowedOrders.includes(order.toLowerCase())) {
      return res.badRequest({
        message: 'order must be asc or desc'
      });
    }

    const products = await Product.find().sort(sortBy + ' ' + order.toUpperCase());

    return res.ok(products);
  },

  findOne: async function (req, res) {
    const product = await Product.findOne({
      id: req.param('id')
    });

    if (!product) {
      return res.notFound({
        message: 'khong tim thay san pham'
      });
    }

    return res.ok(product);
  },

  create: async function (req, res) {
    const { name, price, stock, description } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      description
    }).fetch();

    return res.status(201).json(product);
  },

  update: async function (req, res) {
    const values = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description
    };

    Object.keys(values).forEach((key) => {
      if (values[key] === undefined) {
        delete values[key];
      }
    });

    const product = await Product.updateOne({ id: req.param('id') }).set(values);

    if (!product) {
      return res.notFound({
        message: 'Chua update duoc san pham'
      });
    }

    return res.ok(product);
  },

  destroy: async function (req, res) {
    const product = await Product.destroyOne({ id: req.param('id') });

    if (!product) {
      return res.notFound({
        message: 'Product not found'
      });
    }

    return res.ok(product);
  }
};
