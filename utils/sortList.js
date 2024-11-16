const sortList = (list, property, order = "asc") => {
  if (typeof list[0][property] === "string" && order === "asc") {
    return list.sort((a, b) => a[property].localeCompare(b[property]));
  } else if (typeof list[0][property] === "string" && order === "desc") {
    return list.sort((a, b) => b[property].localeCompare(a[property]));
  }

  if (order === "asc") {
    return list.sort((a, b) => a[property] - b[property]);
  } else if (order === "desc") {
    return list.sort((a, b) => b[property] - a[property]);
  }
};

export { sortList };
