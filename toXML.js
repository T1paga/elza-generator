// const fs = require("fs");
// const yaml = require("js-yaml");
// const { create } = require("xmlbuilder2");
// const axios = require("axios");

// const ymlData = yaml.load(fs.readFileSync("products.yml", "utf8"));

// axios
//   .get(
//     "https://a94c4bc2dfbd4a62d97b2fee8ccda5d2:294615e8ec0a49cc8dcf3bc0bff747f1@elza-nsk.ru/admin/collections.json"
//   )
//   .then((response) => {
//     const collections = response.data;
//     const categories = [];

//     collections.forEach((collection) => {
//       if (collection.is_hidden !== true) {
//         categories.push({
//           id: collection.id,
//           parentId: collection.parent_id,
//           title: collection.title,
//         });
//       }
//     });

//     const offers = [];

//     ymlData.forEach((product) => {
//       if (product.variants.length > 0) {
//         product.variants.forEach((variant) => {
//           let categoryId =
//             product.collections_ids && product.collections_ids.length > 0
//               ? product.collections_ids.slice(-1)
//               : "2288869";
//           const barcode = variant.barcode || "";

//           const params = [
//             { "@name": "Заголовок", "#text": product.title },
//             {
//               "@name": "Краткое описание",
//               "#text": product.short_description,
//             },
//             { "@name": "Размер", "#text": variant.title },
//             { "@name": "Вес", "#text": variant.weight },
//           ];

//           const offer = {
//             "@type": "vendor.model",
//             "@available": variant.available,
//             "@id": variant.id,
//             picture: product.images.map((image) => image.url),
//             price: variant.price,
//             quantity: variant.quantity,
//             currencyId: "RUB",
//             categoryId: categoryId,
//             param: params,
//             barcode: barcode,
//           };

//           offers.push(offer);
//         });
//       }
//     });

//     const xml = create({
//       yml_catalog: {
//         "@date": "2024-02-27 05:06",
//         shop: {
//           name: "elza-nsk",
//           company: "Интернет-магазин elza-nsk",
//           url: "https://elza-nsk.ru/",
//           platform: "InSales",
//           currencies: {
//             currency: { "@id": "RUB", "@rate": "1.0" },
//           },
//           categories: {
//             category: categories.map((category) => ({
//               "@id": category.id,
//               "@parentId": category.parentId ? category.parentId : undefined,
//               "#text": category.title,
//             })),
//           },
//           offers: {
//             offer: offers.map((offer) => ({
//               "@type": offer["@type"],
//               "@available": offer["@available"],
//               "@id": offer["@id"],
//               picture: offer.picture,
//               price: offer.price,
//               quantity: offer.quantity,
//               currencyId: offer.currencyId,
//               categoryId: offer.categoryId,
//               param: offer.param,
//               barcode: offer.barcode,
//             })),
//           },
//         },
//       },
//     });

//     fs.writeFileSync("output.xml", xml.end({ prettyPrint: true }), "utf8");
//   })
//   .catch((error) => {
//     console.error("Ошибка при запросе к серверу:", error);
//   });

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
      if (product.variants.length > 0 && product.is_hidden !== true) {
        product.variants.forEach((variant) => {
          let categoryId =
            variant.collections_ids && variant.collections_ids.length > 0
              ? variant.collections_ids[0]
              : product.category_id;
          const barcode = variant.barcode || "barcode is empty";

          const params = [
            { "@name": "Заголовок", "#text": product.title },
            { "@name": "Размер", "#text": variant.title },
            { "@name": "Вес", "#text": variant.weight },
          ];

          const description = {
            description: {
              "#raw": `<![CDATA[${product.short_description}]]>`,
            },
          };

          const offer = {
            "@type": "vendor.model",
            "@available": true,
            "@id": variant.id,
            picture: product.images.map((image) => image.url),
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

    fs.writeFileSync("output.xml", xml.end({ prettyPrint: true }), "utf8");
  })
  .catch((error) => {
    console.error("Ошибка при запросе к серверу:", error);
  });

// const fs = require("fs");
// const yaml = require("js-yaml");
// const { create } = require("xmlbuilder2");
// const axios = require("axios");

// const ymlData = yaml.load(fs.readFileSync("products.yml", "utf8"));

// axios
//   .get(
//     "https://a94c4bc2dfbd4a62d97b2fee8ccda5d2:294615e8ec0a49cc8dcf3bc0bff747f1@elza-nsk.ru/admin/collections.json"
//   )
//   .then((response) => {
//     const collections = response.data;
//     const categories = [];
//     const offers = [];

//     collections.forEach((collection) => {
//       if (collection.is_hidden !== true) {
//         categories.push({
//           id: collection.id,
//           parentId: collection.parent_id || "",
//           title: collection.title,
//         });
//       }
//     });

//     ymlData.forEach((product) => {
//       if (product.variants.length > 0 && product.is_hidden !== true) {
//         product.variants.forEach((variant) => {
//           let categoryId =
//             variant.collections_ids && variant.collections_ids.length > 0
//               ? variant.collections_ids[0]
//               : product.category_id || "";

//           const barcode = variant.barcode || "barcode is empty";

//           const params = [
//             { "@name": "Заголовок", "#text": product.title },
//             { "@name": "Размер", "#text": variant.title },
//             { "@name": "Вес", "#text": variant.weight || "null" },
//           ];

//           const description = product.short_description;

//           const pictureUrls = product.images.map((image) => image.url);

//           const offer = create()
//             .ele("offer")
//             .att("type", "vendor.model")
//             .att("available", true)
//             .att("id", variant.id)
//             .ele("picture")
//             .txt(pictureUrls.join("\n"))
//             .up()
//             .ele("price")
//             .txt(variant.price)
//             .up()
//             .ele("quantity")
//             .txt(variant.quantity)
//             .up()
//             .ele("currencyId")
//             .txt("RUB")
//             .up()
//             .ele("categoryId")
//             .txt(categoryId)
//             .up()
//             .ele("param")
//             .ele(params.map((param) => "param").join("\n"))
//             .up()
//             .ele("barcode")
//             .txt(barcode)
//             .up()
//             .ele("description")
//             .dat(description);

//           offers.push(offer);
//         });
//       }
//     });

//     const xml = create()
//       .ele("yml_catalog")
//       .att("date", "2024-02-27 05:06")
//       .ele("shop")
//       .ele("categories")
//       .ele(categories.map((category) => "category").join("\n"))
//       .up()
//       .ele("offers")
//       .ele(offers.map((offer) => "offer").join("\n"))
//       .up()
//       .end({ prettyPrint: true });

//     fs.writeFileSync("output.xml", xml, "utf8");
//   })
//   .catch((error) => {
//     console.error("Ошибка при запросе к серверу:", error);
//   });
