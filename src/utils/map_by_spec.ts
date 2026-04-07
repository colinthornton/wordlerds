import { expect, test } from "bun:test";
import { mapBy } from "./map_by";

test("indexes the items in the `list` by the value of their `key` property", () => {
  expect(
    mapBy(
      [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
      ],
      "id",
    ),
  ).toEqual(
    new Map([
      [1, { id: 1, name: "first" }],
      [2, { id: 2, name: "second" }],
    ]),
  );
});
