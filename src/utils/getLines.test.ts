import assert from "node:assert/strict";
import test from "node:test";

import getLines from "./getLines.js";

function getTextWidth(text: string): number {
  return text.length;
}

test("Should properly line up a large text.", () => {
  const text = [
    "Les représentants du peuple français, constitués en Assemblée nationale, ",
    "considérant que l'ignorance, l'oubli ou le mépris des droits de l'homme s",
    "ont les seules causes des malheurs publics et de la corruption des gouver",
    "nements, ont résolu d'exposer, dans une déclaration solennelle, les droit",
    "s naturels, inaliénables et sacrés de l'homme, afin que cette déclaration",
    ", constamment présente à tous les membres du corps social, leur rappelle ",
    "sans cesse leurs droits et leurs devoirs ; afin que les actes du pouvoir ",
    "législatif et ceux du pouvoir exécutif, pouvant être à chaque instant com",
    "parés avec le but de toute institution politique, en soient plus respecté",
    "s ; afin que les réclamations des citoyens, fondées désormais sur des pri",
    "ncipes simples et incontestables, tournent toujours au maintien de la Con",
    "stitution et au bonheur de tous.",
  ].join("");
  const lines = [...getLines(getTextWidth, 40, text)];
  assert.deepStrictEqual(lines, [
    { text: "Les représentants du peuple français,", width: 37 },
    { text: "constitués en Assemblée nationale,", width: 34 },
    { text: "considérant que l'ignorance, l'oubli ou", width: 39 },
    { text: "le mépris des droits de l'homme sont les", width: 40 },
    { text: "seules causes des malheurs publics et de", width: 40 },
    { text: "la corruption des gouvernements, ont", width: 36 },
    { text: "résolu d'exposer, dans une déclaration", width: 38 },
    { text: "solennelle, les droits naturels,", width: 32 },
    { text: "inaliénables et sacrés de l'homme, afin", width: 39 },
    { text: "que cette déclaration, constamment", width: 34 },
    { text: "présente à tous les membres du corps", width: 36 },
    { text: "social, leur rappelle sans cesse leurs", width: 38 },
    { text: "droits et leurs devoirs ; afin que les", width: 38 },
    { text: "actes du pouvoir législatif et ceux du", width: 38 },
    { text: "pouvoir exécutif, pouvant être à chaque", width: 39 },
    { text: "instant comparés avec le but de toute", width: 37 },
    { text: "institution politique, en soient plus", width: 37 },
    { text: "respectés ; afin que les réclamations", width: 37 },
    { text: "des citoyens, fondées désormais sur des", width: 39 },
    { text: "principes simples et incontestables,", width: 36 },
    { text: "tournent toujours au maintien de la", width: 35 },
    { text: "Constitution et au bonheur de tous.", width: 35 },
  ]);
});

test("Should properly line up a short text.", () => {
  const text = "Lorem ipsum dolor sit amet.";
  const lines = [...getLines(getTextWidth, 12, text)];
  assert.deepStrictEqual(lines, [
    { text: "Lorem ipsum", width: 11 },
    { text: "dolor sit", width: 9 },
    { text: "amet.", width: 5 },
  ]);
});

test("Should put a naturally-overflowing word on its own line.", () => {
  const text = [
    "C'est ce qui les rend anticonstitutionnels, et qui dans trente ans, fera ",
    "libéraux leurs successeurs en génie.",
  ].join("");
  const lines = [...getLines(getTextWidth, 15, text)];
  assert.deepStrictEqual(lines, [
    { text: "C'est ce qui", width: 12 },
    { text: "les rend", width: 8 },
    { text: "anticonstitutionnels,", width: 21 },
    { text: "et qui dans", width: 11 },
    { text: "trente ans,", width: 11 },
    { text: "fera libéraux", width: 13 },
    { text: "leurs", width: 5 },
    { text: "successeurs en", width: 14 },
    { text: "génie.", width: 6 },
  ]);
});
