const fs = require("fs");
const yaml = require("js-yaml");
const { create } = require("xmlbuilder2");
const axios = require("axios");

const ymlData = yaml.load(fs.readFileSync("products.yml", "utf8"));

axios
  .get(
    "https://a94c4bc2dfbd4a62d97b2fee8ccda5d2:294615e8ec0a49cc8dcf3bc0bff747f1@elza-nsk.ru/admin/collections.json"
  )
  .then((response) => {
    const collections = response.data;
    const categories = [];

    collections.forEach((collection) => {
      if (collection.is_hidden !== true) {
        categories.push({
          id: collection.id,
          parentId: collection.parent_id,
          title: collection.title,
        });
      }
    });

    const offers = [];

    ymlData.forEach((product) => {
      if (product.variants.length > 0 && product.is_hidden === false) {
        product.variants.forEach((variant) => {
          let categoryId = product.canonical_url_collection_id;
          const barcode = variant.barcode || "";

          const params = [
            { "@name": "Заголовок", "#text": product.title },
            { "@name": "Вес", "#text": variant.weight },
          ];

          if (variant.title) {
            params.push({ "@name": "Размер", "#text": variant.title });
          }

          const description = {
            description: {
              "#raw": `${product.short_description || ""}`,
            },
          };

          const article =
            product.title.substring(0, 3).toUpperCase() + variant.id;

          const offer = {
            "@type": "vendor.model",
            "@available": true,
            "@id": variant.id,
            name: product.title,
            vendorCode: article, // ===
            sku: article, // ===
            picture: product.images.map(
              (image) => image.original_url || image.url // ====
            ),
            price: variant.price,
            quantity: variant.quantity,
            currencyId: "RUB",
            categoryId: categoryId,
            param: params,
            barcode: barcode,
            ...description,
          };

          offers.push(offer);
        });
      }
    });

    const xml = create({
      yml_catalog: {
        "@date": "2024-02-27 05:06",
        shop: {
          name: "elza-nsk",
          company: "Интернет-магазин elza-nsk",
          url: "https://elza-nsk.ru/",
          platform: "InSales",
          currencies: {
            currency: { "@id": "RUB", "@rate": "1.0" },
          },
          categories: {
            category: categories.map((category) => ({
              "@id": category.id,
              "@parentId": category.parentId ? category.parentId : undefined,
              "#text": category.title,
            })),
          },
          offers: {
            offer: offers.map((offer) => ({
              "@type": offer["@type"],
              "@available": offer["@available"],
              "@id": offer["@id"],
              name: offer.name, // ===
              vendorCode: offer.vendorCode, // ===
              sku: offer.sku, // ===
              picture: offer.picture,
              price: offer.price,
              quantity: offer.quantity,
              currencyId: offer.currencyId,
              categoryId: offer.categoryId,
              param: offer.param,
              barcode: offer.barcode,
              description: offer.description,
            })),
          },
        },
      },
    });

    const xmlString = xml.end({ prettyPrint: true });
    const replacedXmlString = xmlString.replace(/&nbsp;/g, "&#160;"); // Замена &nbsp; на эквивалент в XML

    fs.writeFileSync("output.xml", replacedXmlString, "utf-8");
  })
  .catch((error) => {
    console.error("Ошибка при запросе к серверу:", error);
  });
