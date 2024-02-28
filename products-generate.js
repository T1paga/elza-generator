const fs = require("fs");
const axios = require("axios");
const yaml = require("js-yaml");

const API_URL =
  "https://a94c4bc2dfbd4a62d97b2fee8ccda5d2:294615e8ec0a49cc8dcf3bc0bff747f1@elza-nsk.ru/admin/products";
const GET_COUNT_ITEM_URL = API_URL + "/count.json";
const FILE_PATH = "products.yml";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProductCount(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data.count;
  } catch (error) {
    console.error("Error when receiving the total number of items:", error);
    return null;
  }
}

async function fetchAllProducts(apiUrl, totalCount) {
  const productsPerPage = 250;
  const totalPages = Math.ceil(totalCount / productsPerPage);
  let allProducts = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const response = await axios.get(
        `${apiUrl}?page=${page}&per_page=${productsPerPage}`
      );
      allProducts = allProducts.concat(response.data);
      console.log(
        `Uploaded ${response.data.length} products from the page ${page}`
      );
    } catch (error) {
      console.error(`Error loading data from the page ${page}:`, error);
    }

    await delay(1000);
  }

  return allProducts;
}

function saveAsYaml(data, filePath) {
  try {
    const yamlData = yaml.dump(data);
    fs.writeFileSync(filePath, yamlData);
    console.log("The data has been successfully saved to a file:", filePath);
  } catch (error) {
    console.error("Error saving data to a file:", error);
  }
}

fetchProductCount(GET_COUNT_ITEM_URL)
  .then(async (totalCount) => {
    if (totalCount) {
      const allProducts = await fetchAllProducts(API_URL + ".json", totalCount);
      if (allProducts.length > 0) {
        saveAsYaml(allProducts, FILE_PATH);
      } else {
        console.log("The product data could not be uploaded.");
      }
    } else {
      console.log("The total number of items could not be received.");
    }
  })
  .catch((error) => {
    console.error("An error has occurred:", error);
  });
