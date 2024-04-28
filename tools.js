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
    .required("should be a string")
});
// JSON style of the getAgentName Schema
const getAgentNameJSONSchema = yupToJsonSchema(getAgentNameSchema);

// Schema for getSoldProperties tool

// Defining the getSoldProperties Schema
const getSoldPropertiesSchema = yup.object({
  property: yup.string().label("soldProperties").required("should be a string")
});
// JSON style of the getSoldProperties Schema
const getSoldPropertiesJSONSchema = yupToJsonSchema(getSoldPropertiesSchema);

// Schema for getNumSoldProperties tool

// Defining the getNumSoldProperties  Schema
const getNumSoldPropertiesSchema = yup.object({
  numProperty: yup
    .string()
    .label("numOfsoldProperties")
    .required("should be a string")
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
    .required("should be a string")
});
// JSON style of the getNumSoldProperties  Schema
const getTopCustomersJSONSchema = yupToJsonSchema(getTopCustomersSchema);

// Schema for getAllProperties tool

// Defining the getAllProperties Schema
const getAllPropertiesSchema = yup.object({
  Property: yup.string().label("allProperties").required("should be a string")
});
// JSON style of the getNumSoldProperties  Schema
const getAllPropertiesJSONSchema = yupToJsonSchema(getAllPropertiesSchema);

// Schema for getNumProperties tool

// Defining the getNumProperties  Schema
const getNumPropertiesSchema = yup.object({
  numProperty: yup
    .string()
    .label("numOfProperties")
    .required("should be a string")
});
// JSON style of the getNumProperties  Schema
const getNumPropertiesJSONSchema = yupToJsonSchema(getNumPropertiesSchema);

// Schema for sendApprMail tool

// Defining the sendApprMail Schema
const sendApprMailSchema = yup.object({
  customerName: yup
    .string()
    .label("customerName")
    .required("should be a string"),
  customerEmail: yup
    .string()
    .label("customerEmail")
    .required("should be a string"),
  propertyName: yup
    .string()
    .label("propertyName")
    .required("should be a string")
});

// JSON style of the sendApprMail Schema
const sendApprMailJSONSchema = yupToJsonSchema(sendApprMailSchema);

// Schema for setNewProperty tool

// Defining the setNewProperty Schema
const setNewProperty = yup.object().shape({
  name: yup.string().label("name").required("Name should be a string"),
  locationLat: yup
    .number()
    .label("locationLat")
    .required("Location latitude should be a number"),
  locationLong: yup
    .number()
    .label("locationLong")
    .required("Location longitude should be a number"),
  costPrice: yup
    .number()
    .label("costPrice")
    .required("Cost price should be a number"),
  sellingPrice: yup
    .number()
    .label("sellingPrice")
    .required("Selling price should be a number")
});

// JSON style of the setNewProperty Schema
const setNewPropertyJsonSchema = yupToJsonSchema(setNewProperty);

// Defining the getAllAgents Schema
const getAllAgentsSchema = yup.object({
  agentProperty: yup
    .string()
    .label("numOfsoldProperties")
    .required("should be a string")
});
// JSON style of the getAllAgents Schema
const getAllAgentsSchemaJSONSchema = yupToJsonSchema(getAllAgentsSchema);

// Schema for getTopAgents tool

// Defining the getTopAgentsProperties  Schema
const getTopAgentsSchema = yup.object({
  Property: yup.string().label("topAgentsList").required("should be a string")
});
// JSON style of the getTopAgentsProperties  Schema
const getTopAgentsJSONSchema = yupToJsonSchema(getTopAgentsSchema);

//DEFINING TOOLS
// getAgentName tool definition
const getAgentName = {
  name: "get_agent_name",
  description: "Gets the agents that has only sold a property or more",
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
          propertyName
        }
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getSoldProperties tool definition
const getSoldProperties = {
  name: "get_sold_properties",
  description: "Gets the names of the properties that have only been sold",
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
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getNumSoldProperties tool definition
const getNumSoldProperties = {
  name: "get_num_sold_properties",
  description: "Gets the numbers of the properties that have only been sold",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getNumSoldPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/getNumSold`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getTopCustomers tool definition
const getTopCustomers = {
  name: "get_top_customers",
  description:
    "Gets all the customers that has spent money purchasing a property or more then lists them in descending order starting from the highest paying customer",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getTopCustomersJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/topCustomers`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getTopAgents tool definition
const getTopAgents = {
  name: "get_top_agents",
  description:
    "Gets all the agents that has the highest sum of customer ratings and lists them in descending order starting from the highest paying customer",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getTopAgentsJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/topAgents`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getAllProperties tool definition
const getAllProperties = {
  name: "get_all_properties",
  description:
    "Gets all the properties the organization has regardless of whether they are sold or not and returns the result",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getAllPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/getAll`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// sendApprMail tool definition
const sendApprMail = {
  name: "send_appr_mail",
  description:
    "Sends an appreciation mail to customers specified thanking them for their purchase and patronage",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: sendApprMailJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ customerName, customerEmail, propertyName }) => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/sendThanks`,
        method: "post",
        data: {
          customerName,
          customerEmail,
          propertyName
        }
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getNumProperties tool definition
const getNumProperties = {
  name: "get_num_properties",
  description:
    "Gets the total number of the properties that the organization has regardless of whether they are sold or not",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getNumPropertiesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      const { data } = await axios({
        url: `http://localhost:3000/getTotalNum`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

//setNewProperties tool definition
const setNewProperties = {
  name: "set_new_property",
  description:
    "Creates a new property the company just recently obtained and saves the data to the database",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: setNewPropertyJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({
    name,
    locationLat,
    locationLong,
    costPrice,
    sellingPrice
  }) => {
    try {
      //console.log(name, locationLat, locationLong, costPrice, sellingPrice);
      const { data } = await axios({
        url: `http://localhost:3000/setProperty`,
        method: "post",
        data: {
          name,
          locationLat,
          locationLong,
          costPrice,
          sellingPrice
        }
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

// getSoldProperties tool definition
const getAllAgents = {
  name: "get_all_agents",
  description:
    "Gets the names and email addresses of all agents in the company regardless of whether they have sold a property or not",
  category: "hackathon",
  subcategory: "backend",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getAllAgentsSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async () => {
    try {
      //console.log(propertyName);
      const { data } = await axios({
        url: `http://localhost:3000/getAllAgents`,
        method: "get"
      });
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  }
};

const tools = [
  getAgentName,
  getSoldProperties,
  getNumSoldProperties,
  getTopCustomers,
  getAllProperties,
  getNumProperties,
  sendApprMail,
  setNewProperties,
  getAllAgents,
  getTopAgents
];
module.exports = tools;
