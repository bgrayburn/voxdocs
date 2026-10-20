import { expect, test } from "@playwright/test";

test("creates a document, toggles a task, persists it, and sends the updated document", async ({
  page,
}) => {
  const requests: unknown[] = [];
  await page.route("**/api/instruct", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      json:
        requests.length === 1
          ? {
              document: "# Groceries\n- [ ] Milk",
              message: "Created your list",
            }
          : {
              document: "# Groceries\n- [x] Milk\n- [ ] Eggs",
              message: "Added eggs",
            },
    });
  });

  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Instruction", exact: true })
    .fill("Create a grocery list with milk");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Groceries" })).toBeVisible();
  await expect(
    page.getByText("Created your list", { exact: true }),
  ).toBeVisible();
  expect(requests[0]).toEqual({
    instruction: "Create a grocery list with milk",
    document: "",
  });

  await page.getByRole("checkbox").check();
  await page.reload();
  await expect(page.getByRole("checkbox")).toBeChecked();

  await page
    .getByRole("textbox", { name: "Instruction", exact: true })
    .fill("Add eggs");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("checkbox")).toHaveCount(2);
  expect(requests[1]).toEqual({
    instruction: "Add eggs",
    document: "# Groceries\n- [x] Milk",
  });
  await expect(page.getByRole("checkbox").first()).toBeChecked();
});
