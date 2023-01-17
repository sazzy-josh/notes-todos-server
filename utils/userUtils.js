/**
 * It takes an array of objects, and returns an array of objects with the same keys, but with the
 * values of the keys being the sum of the values of the keys in the original array
 * @param dataset - an array of objects
 * @returns An array of objects with the title and total properties.
 */
const sumUpTodosAndNotes = (dataset) => {
  let new_data_set = [];

  dataset.map((data) => {
    let data_obj = {};

    data_obj.title = data.title;
    data_obj.total = data.todos + data.notes;

    new_data_set.push(data_obj);
  });

  return new_data_set;
};

/**
 * It takes in an array of objects, and returns an array of objects with the total number of todos in
 * each category
 * @param dataset - the array of objects that you want to categorize
 * @returns An array of objects with the category and total of each category.
 */
const categorizeTodos = (dataset) => {
  let categories = [
    { title: "backlog", total: 0 },
    { title: "ongoing", total: 0 },
    { title: "completed", total: 0 },
    { title: "postponed", total: 0 },
  ];

  dataset.map((data) => {
    if (data.category === "backlog") categories[0].total += 1;
    if (data.category === "ongoing") categories[1].total += 1;
    if (data.category === "completed") categories[2].total += 1;
    if (data.category === "postponed") categories[3].total += 1;
  });

  return categories;
};

module.exports = {
  sumUpTodosAndNotes,
  categorizeTodos,
};
