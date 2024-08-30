var ind = -1;

function Name_content() {
  let Nodes = []; // The type is [Cartesian Vector]

  // Check every carbon of list
  for (let i = 0; i < Structure.length; i++) {
    for (let j = 0; j < Structure[i].length; j++) {
      if (Structure[i][j].length === 1) {
        Nodes.push([i, j]);
      }
    }
  }

  let chains = [];
  for (let node of Nodes) { // Save every chain in the Structure
    let usedPlaces = [node]; let visited = [node]; let prevList = [];
    findChains( // Run the function for every node of the Structure list
      Structure[node[0]][node[1]], node, usedPlaces, prevList, visited, 0, Nodes, chains
    );
  }

  // Guess the biggest chain of all and the list of all biggest
  let largestChain = chains.reduce((prev, curr) => prev.length > curr.length ? prev : curr, []);
  let everyChain = chains.filter(chain => chain.length === largestChain.length);

  let everySum = []; // Find carbons
  for (let longChain of everyChain) {
    let indexes = []; // All close to longest
    for (let i = 0; i < Structure.length; i++) {
      for (let j = 0; j < Structure[i].length; j++) {
        if (!longChain.some(([x,y]) => x===i && y===j) && Structure[i][j].length>0) {
          indexes.push([i,j]);
        }
      }
    }

    let sumI = []; // Find the index of all_radicals
    for (let j=0; j<indexes.length; j++) {
      let pos = indexes[j];
      for (let tup of Structure[pos[0]][pos[1]]) {
        let x = pos[0] + tup[1];
        let y = pos[1] + tup[0];
        if (longChain.some(([a,b]) => a===x && b===y)) {
          let index = longChain.findIndex(([a,b]) => a===x && b===y);
          sumI.push(index + 1);
        }
      }
    }
    everySum.push(sumI);
  }

  // Find the indices of the smallest sums
  let minSumIndices = everySum.reduce((minIndices, currentArray, currentIndex) => {
    const currentSum = currentArray.reduce((acc, val) => acc + val, 0);
    const minSum = everySum[minIndices[0]].reduce((acc, val) => acc + val, 0);

    if (currentSum < minSum) {
      return [currentIndex];
    } else if (currentSum === minSum && !minIndices.some(sum => sum === currentIndex)) {
      minIndices.push(currentIndex);
    }

    return minIndices;
  }, [0]);

  ind = (ind+1) %minSumIndices.length; 
  let minSumIndex = minSumIndices[ind];

  let allRadicals = []; let usedRadicals = [];
  everySum[minSumIndex].forEach((sum, i) => {
    let begin = everyChain[minSumIndex][sum-1];

    let izo = "";
    let cross = [];
    let branch = [false, ""];

    let previusNum = usedRadicals.length;
    branch = findRadicals(begin, usedRadicals, everyChain, minSumIndex, cross, branch);
    let num = usedRadicals.length - previusNum;

    if (branch[0]) {izo = branch[1]; if (num === 3) izo = "izo"}
    let ind = allRadicals.findIndex(rad => rad[0]===num && rad[2]===izo);

    if (ind === -1) allRadicals.push([ num, [sum], izo ]);
    else allRadicals[ind][1].push(sum); // Save it
  });

  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  console.log("---------------------");//
  console.log(allRadicals);//$$$$$$$$$$//
  console.log("---------------------");//
  console.log(everyChain[minSumIndex]);//
  console.log("---------------------");//
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//

  // Sorting allRadicals based on the number
  allRadicals.sort((a, b) => a[0] - b[0]);
  allRadicals.forEach(innerArray => {
    innerArray[1].sort((a, b) => a - b);
  });

  //Remove any previus child of the name container
  let nameContainer = document.getElementById('name_Structure');
  while (nameContainer.firstChild) { // Remove all children
    nameContainer.removeChild(nameContainer.firstChild);
  }

  const memoryGrid = document.getElementById('memoryGrid');
  const cells = memoryGrid.querySelectorAll('.dot'); // Restore to default
  memoryGrid.querySelectorAll('.cell').forEach(cell => cell.className = 'cell');

  // Find all radical formations and their types
  let usedRadicalsName = [];
  everySum[minSumIndex].forEach((sum, i) => {
    let begin = everyChain[minSumIndex][sum-1];
        
    let izo = "";
    let cross = []; 
    let branch = [false, ""];

    let beginIndex = usedRadicalsName.length;
    branch = findRadicals(begin, usedRadicalsName, everyChain, minSumIndex, cross, branch);
    let changeIndex = usedRadicalsName.slice(beginIndex); // Save the branch names

    if (branch[0]) {izo = branch[1]; if (changeIndex.length === 3) izo = "izo"}
    updateStructureCells(cells, prefix, changeIndex, izo);
  });
  updateStructureCells(cells, prefix, everyChain[minSumIndex]);

  // Placeholder for the radical names
  let radicalNames = ""

  // Run for every radical formation
  allRadicals.forEach(radical => {

    // Determine prefix, carbons
    let branch = radical[2]; // name
    let prefixIndex = radical[0] - 1;
    let carbonCount = radical[1].length;

    // Add the appropriate number prefix for the carbon chains and branch
    let prefixName = number[carbonCount - 1] + branch + prefix[prefixIndex];

    //hydrocarbonName += prefixName + "il-"; // Add the "thyle" group
    let name = prefixName + "il-" + radical[1].join(",") + "-";
    radicalNames += name; // Save the radical

    // Create the placeholder for this
    const radicalContainer = document.createElement('div');
    radicalContainer.innerHTML += name;

    // Add the name class to change the color
    radicalContainer.classList.add('name');
    radicalContainer.classList.add(prefix[prefixIndex %10]);

    // Add the longest to the main div list of page
    nameContainer.appendChild(radicalContainer);

    if (radical[2]) { // The izo property for the radical name color
      const BGcolor = window.getComputedStyle(radicalContainer).backgroundColor;
      radicalContainer.style.setProperty('--hydrocarbon-color', BGcolor);
      radicalContainer.classList.add(radical[2]);
    }
  });

  // Determine the suffix for longest chain
  const longNameContainer = document.createElement('div');
  let suffixIndex = everyChain[minSumIndex].length - 1;
  longNameContainer.innerHTML += prefix[suffixIndex] + "an";

  // Add the name class to change the color of it when shown
  longNameContainer.classList.add('name'); // Add monospace
  longNameContainer.classList.add(prefix[suffixIndex %10]);

  // Add the longest to the main div list
  nameContainer.appendChild(longNameContainer);

  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  console.log("---------------------");//$$$$$$$$$$$$//
  console.log(radicalNames+prefix[suffixIndex]+"an");//
  console.log("---------------------");//$$$$$$$$$$$$//
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
}










// Function to find every possible chain
function findChains(nodes, pos, usedPlaces, prevList, visited, i, Nodes, chains) {
  // Get the nex positon
  let x = pos[0] + nodes[i][1];
  let y = pos[1] + nodes[i][0];
  let newPos = [x, y];

  // Skip if a checked position
  if (visited.some(([a, b]) => a === newPos[0] && b === newPos[1])) {
    findChains(nodes, pos, usedPlaces, prevList, visited, i + 1, Nodes, chains);
    return;
  }

  // Append the latest position 
  usedPlaces.push(newPos);
  visited.push(newPos);

  // Save a copy to get to afterwards in the code
  let listSize = Structure[newPos[0]][newPos[1]].length;
  if (listSize>2) { for (let i=0; i<listSize-2; i++) {
    prevList.push([...usedPlaces]);} // Each saved
  }

  if (Nodes.some(([a, b]) => a === newPos[0] && b === newPos[1])) {
    // Save the chain and return
    chains.push([...usedPlaces]);

    // If not any more saved before
    if (prevList.length === 0) return; // Found all

    // Return to the previous_list
    usedPlaces = [...prevList[prevList.length - 1]];
    // Return to the latest pos of the usedplaces
    newPos = usedPlaces[usedPlaces.length - 1];
    prevList.pop(); // Open a new a spot
  }

  findChains( // Calculate for the next position of the node
    Structure[newPos[0]][newPos[1]], newPos, usedPlaces, prevList, visited, 0, Nodes, chains
  );
}











// Function to find every possible formation
function findRadicals(beginPos, usedRadicals, everyChain, minSumIndex, cross, branch) {
  let branches = ["izo", "sek", "tert"]; // Branch prefixes of radicals
  for (let carbon of Structure[beginPos[0]][beginPos[1]]) {
    let x = beginPos[0] + carbon[1]; // Row value
    let y = beginPos[1] + carbon[0]; // Column value
    let newPos = [x, y]; // New position to check

    const isWasDuplicate = everyChain[minSumIndex].some(([a, b]) => a===beginPos[0] && b===beginPos[1]);
    const isChainDuplicate = everyChain[minSumIndex].some(([a, b]) => a===x && b===y);
    const isRadicalUsed = usedRadicals.some(([a, b]) => a===x && b===y);

    if (isWasDuplicate && !isRadicalUsed) branch[1] = branches[Structure[x][y].length-2];
    if (isChainDuplicate || isRadicalUsed) continue;

    usedRadicals.push(newPos); // Add the new position to the usedRadicals
    for (let i=0; i<Structure[x][y].length-2; i++) cross.push(newPos);
    if (cross.length > 0) branch[0] = true; // Update the crosses

    if (Structure[x][y].length === 1) { // If it was a node founded
      if (cross.length === 0) return branch; // Return if no more crosses
      // Return to the latest pos of the usedRadicals list
      newPos = cross[cross.length- 1];
      cross.pop(); // Open a new a spot
    }

    return findRadicals(newPos, usedRadicals, everyChain, minSumIndex, cross, branch);
  }
  return branch;
}










// Save the colors and set the classes for every cell of grid
function updateStructureCells(cells, prefix, indexData, izoClass) {

  for (let pos of indexData) {
    let remove = 0; // Flag for empty cell
    for (let i = 0; i < Structure.length; i++) {
      let found = false; // Flag for founded cells
      for (let j = 0; j < Structure[i].length; j++) {

        if (Structure[i][j].length === 0) {
          remove += 1; continue;
        }

        // If founded in the grid
        if (i === pos[0] && j === pos[1]) {
          let index = i * Structure[i].length + j - remove;
          cells[index].parentNode.classList.add(prefix[(indexData.length - 1) %10]);

          if (izoClass) { // Calculate the color for the type of alkyl group of radical
            const computedColor = window.getComputedStyle(cells[index].parentNode).backgroundColor;
            cells[index].parentNode.style.setProperty('--hydrocarbon-color', computedColor);
            cells[index].parentNode.classList.add(izoClass);
          }
              
          found = true; break; // Break if founded
        }
      }
      if (found) break; // Break if founded
    }
  }
}