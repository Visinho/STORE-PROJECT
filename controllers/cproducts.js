const Product = require("../models/product");

// const getAllProductsStatic = async (req, res) => {
//throw error beginning
//throw new Error("testing async errors");
//throw error end
//FIND logic
//   const products = await Product.find({})
//   const products = await Product.find({ featured: "true" });
//FIND logic end

//SEARCH functionality
//   const search = "ab";
//   const products = await Product.find({
//     name: {
//       $regex: search,
//       $options: "i",
//     },
//   });
//SEARCH functionality end
//   res.status(200).json({ products, nbHits: products.length });
// };

const getAllProductsStatic = async (req, res) => {
  //const products = await Product.find({}).sort("-name price");
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price")
    .limit(10)
    .skip(2);
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lt",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    //console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  } else {
    console.log(error);
  }

  console.log(queryObject);
  let result = Product.find(queryObject);
  //sort
  if (sort) {
    //products = products.sort();
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  //fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  //limit and skip logic
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

//Numeric Filters

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
