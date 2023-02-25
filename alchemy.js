const potion_colors = "rgb"
const chemicals = ["npN","pnP","pNn","nPp","Nnp","Ppn","NNN","PPP"]
const correct_chem_combos = {"pP": "+", "Pp": "+", "nN": "-", "Nn": "-"}

function getInteraction(c1, c2) {
    for (let i = 0; i < 3; i++) {
        const sign = correct_chem_combos[ c1[i] + c2[i] ]
        if (sign) return potion_colors[i] + sign;
    }
    return "0";
}

function precalculateCodex() {
    const codex = {}
    for (let i = 0; i < chemicals.length; i++) {
        for (let j = i+1; j < chemicals.length; j++) {
            const c1 = chemicals[i];
            const c2 = chemicals[j];
            const result = getInteraction(c1, c2);
            codex[[i,j]] = result;
            codex[[j,i]] = result;
        }
    }
    return codex
}
const codex = precalculateCodex()
// console.log(codex)

function foreachPermutations(array, fcn) {
  var permutation = array.slice();
  var length = permutation.length,
      c = new Array(length).fill(0),
      i = 1, k, p;

  fcn(permutation);
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      fcn(permutation);
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

// let arr = [1, 2, 3];
// foreachPermutations(arr, (x) => console.log(x));

async function recalculate() {
    // get constraints
    // let constraints = [
    //     [0, 1, "=", "r+"],
    //     [0, 2, "≠", "b+"],
    // ]

    let constraints = getConstraints()

    // create new summary array
    const n = chemicals.length
    let summary =  {
        models: 0,
        chemicals: new Array(n)
    }
    for (var i = 0; i < summary.chemicals.length; i++) {
        summary.chemicals[i] = new Array(n).fill(0)
    }

    // calculate
    model = [...Array(n).keys()];
    foreachPermutations(model, x => testModel(x, constraints, summary) );

    // display
    console.log(summary);
    displaySummary(summary);

}

function testModel(model, constraints, summary) {
    if (satisfies(model, constraints)) {
        summary.models++;
        for (let i = 0; i < chemicals.length; i++) {
            summary.chemicals[i][model[i]]++;
        }
    }
}

function satisfies(model, constraints) {
    for (let i = 0; i < constraints.length; i++) {
        const [i1, i2, sign, shouldBe] = constraints[i]

        if (i1 === -1) {
            if (!okUnknown(model, i1, i2, shouldBe)) return false;
            continue;
        }
        if (i2 === -1) {
            if (!okUnknown(model, i2, i1, shouldBe)) return false;
            continue;
        }

        result = codex[[model[i1], model[i2]]]
        if (sign === "=") {
            if (result !== shouldBe) return false;
        } else {
            // console.log(sign);
            if (result === shouldBe) return false;
        }
    }
    return true
}

function okUnknown(model, i1, i2, shouldBe) {
    if (i2 === -1) return true;

    if (shouldBe === "0") return true;

    let chem = chemicals[model[i2]]; // pNn
    let colorIndex = potion_colors.indexOf(shouldBe[0])
    let sign = shouldBe[1]

    if (sign === "+") {
        return "pP".indexOf(chem[colorIndex]) !== -1
    }
    return "nN".indexOf(chem[colorIndex]) !== -1
}

// console.log("start")
// recalculate()


