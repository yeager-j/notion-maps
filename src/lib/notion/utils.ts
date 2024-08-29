import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function getPropertyValue(
  property: PageObjectResponse["properties"][string],
) {
  switch (property.type) {
    case "title":
      return property.title[0].plain_text;
    case "rich_text":
      return property.rich_text[0].plain_text;
    case "checkbox":
      return property.checkbox;
    case "number":
      return property.number;
    case "select":
      return property.select?.name;
    case "relation":
      return property.relation;
    case "url":
      return property.url;
  }
}

export function hasCorrectProperties(result: DatabaseObjectResponse) {
  const requiredProperties = [
    "__coordinate_x",
    "__coordinate_y",
    "__is_metadata",
    "__metadata_map_image",
    "__metadata_map_width",
    "__metadata_map_height",
  ];

  return requiredProperties.every((property) =>
    Object.keys(result.properties).includes(property),
  );
}
