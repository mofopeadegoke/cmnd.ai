require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");

// const getProductSchema = yup.object({
//   product: yup.string().label("product").required("should be a string"),
// });
//
// const getProductsJSONSchema = yupToJsonSchema(getProductSchema);

// Schema for getAgentName tool

// Defining the getAgentName Schema
const getAgentNameSchema = yup.object({
  propertyName: yup
    .string()
    .label("propertyName")
    .required("should be a string"),
});
// JSON style of the getAgentName Schema
const getAgentNameJSONSchema = yupToJsonSchema(getAgentNameSchema);

// Schema for getSoldProperties tool

// Defining the getSoldProperties Schema
const getSoldPropertiesSchema = yup.object({
  property: yup.string().label("soldProperties").required("should be a string"),
});
// JSON style of the getSoldProperties Schema
const getSoldPropertiesJSONSchema = yupToJsonSchema(getSoldPropertiesSchema);

// Schema for getNumSoldProperties tool

// Defining the getNumSoldProperties  Schema
const getNumSoldPropertiesSchema = yup.object({
  numProperty: yup
    .string()
    .label("numOfsoldProperties")
    .required("should be a string"),
});
// JSON style of the getNumSoldProperties  Schema
const getNumSoldPropertiesJSONSchema = yupToJsonSchema(
  getNumSoldPropertiesSchema
);

// Schema for getTopCustomers tool

// Defining the getNumSoldProperties  Schema
const getTopCustomersSchema = yup.object({
  Property: yup
    .string()
    .label("topCustomersList")
    .required("should be a string"),
});
// JSON style of the getNumSoldProperties  Schema
const getTopCustomersJSONSchema = yupToJsonSchema(getTopCustomersSchema);

// Schema for getAllProperties tool

// Defining the getAllProperties Schema
const getAllPropertiesSchema = yup.object({
  Property: yup.string().label("allProperties").required("should be a string"),
});
// JSON style of the getNumSoldProperties  Schema
const getAllPropertiesJSONSchema = yupToJsonSchema(getAllPropertiesSchema);

// Schema for getNumProperties tool

// Defining the getNumProperties  Schema
const getNumPropertiesSchema = yup.object({
  numProperty: yup
    .string()
    .label("numOfProperties")
    .required("should be a string"),
});
// JSON style of the getNumProperties  Schema
const getNumPropertiesJSONSchema = yupToJsonSchema(getNumPropertiesSchema);

// getAgentName tool definition
const getAgentName = {
  name: "get_agent_name",
  description: "Gets the agent that sold a property",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getAgentNameJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ propertyName }) => {
    try {
      //console.log(propertyName);
      const { data } = await axios({
        url: `http://localhost:3000/getAgent`,
        method: "post",
        data: {
          propertyName,
        },
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// getSoldProperties tool definition
const getSoldProperties = {
  name: "get_sold_properties",
  description: "Gets the names of the properties that have been sold",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getSoldPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ propertyName }) => {
    try {
      //console.log(propertyName);
      const { data } = await axios({
        url: `http://localhost:3000/getSold`,
        method: "get",
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// getNumSoldProperties tool definition
const getNumSoldProperties = {
  name: "get_num_sold_properties",
  description: "Gets the numbers of the properties that have been sold",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getNumSoldPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ numProperty }) => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/getNumSold`,
        method: "get",
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// getTopCustomers tool definition
const getTopCustomers = {
  name: "get_top_customers",
  description: "Gets the top paying clients",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getTopCustomersJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ Property }) => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/topCustomers`,
        method: "get",
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// getAllProperties tool definition
const getAllProperties = {
  name: "get_all_properties",
  description: "Gets all the properties the organization has",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getAllPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ Property }) => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/all`,
        method: "get",
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// getNumProperties tool definition
const getNumProperties = {
  name: "get_num_properties",
  description:
    "Gets the total number of the properties that the organization has",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getNumPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ numProperty }) => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/getTotalNum`,
        method: "get",
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// const PRODUCT_FINDER = {
//   name: "product_finder",
//   description:
//     "finds and returns dummy products details from json dummy datas based on the product name passed to it",
//   category: "hackathon",
//   subcategory: "communication",
//   functionType: "backend",
//   dangerous: false,
//   associatedCommands: [],
//   prerequisites: [],
//   parameters: getProductsJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true,
//   runCmd: async ({ product }) => {
//     try {
//       const { data } = await axios.get(
//         `https://dummyjson.com/products/search?q=${encodeURIComponent(product)}`
//       );
//       return JSON.stringify(data);
//     } catch (err) {
//       return "Error trying to execute the tool";
//     }
//   },
// };

// const weatherCitySchema = yup.object({
//   city: yup.string().label("city").required("should be a string"),
// });
// const weatherCityJSONSchema = yupToJsonSchema(weatherCitySchema);
// const WEATHER_FROM_LOCATION = {
//   name: "city_weather_data",
//   description: "gets the weather details from a given city name",
//   category: "hackathon",
//   subcategory: "communication",
//   functionType: "backend",
//   dangerous: false,
//   associatedCommands: [],
//   prerequisites: [],
//   parameters: weatherCityJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true,
//   runCmd: async ({ city }) => {
//     const ApiKey = process.env.WEATHER_API_KEY;
//     try {
//       const { data } = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`
//       );
//       return JSON.stringify({
//         weather: data.weather[0].description,
//         main: data.main,
//         coords: data.coord,
//       });
//     } catch (err) {
//       return "Error trying to execute the tool";
//     }
//   },
// };

const getFilePathSchema = yup.object({
  filePath: yup.string().label("filePath").required("should be a file path"),
});
const getFilePathJSONSchema = yupToJsonSchema(getFilePathSchema);
const FILE_READER = {
  name: "file_reader",
  description:
    "returns the contents of a file given its filepath in the repository",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getFilePathJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ filePath }) => {
    try {
      const buffer = fs.readFileSync(filePath);
      const fileContents = buffer.toString("utf8");
      return fileContents;
    } catch (error) {
      return "An error ocured while looking for the file content";
    }
  },
};

const tools = [
  getAgentName,
  getSoldProperties,
  getNumSoldProperties,
  getTopCustomers,
  FILE_READER,
  getAllProperties,
  getNumProperties,
];
module.exports = tools;
