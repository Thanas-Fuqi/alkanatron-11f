var Structure = [];

function Log_content() { // Show Structure with rows
  const memoryGrid = document.getElementById('memoryGrid');
  const cells = memoryGrid.querySelectorAll('.cell');

  // Create the Structure filled with empty lists to hold the information
  let rows = Array.from({ length: rowCount }, () => Array.from({ length: rowCount }, () => []));

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      const cell = cells[i * rowCount + j];
      const type = cell.dataset.type;

      if (type === contentTypes[1]) {
        (i-1>-1) && (cells[(i-1) * rowCount+j].dataset.type === contentTypes[3]) && rows[i][j].push([ 0,-1]);
        (j+1<rowCount) && (cells[i*rowCount + (j+1)].dataset.type === contentTypes[2]) && rows[i][j].push([1,0]);
        (i+1<rowCount) && (cells[(i+1) * rowCount+j].dataset.type === contentTypes[3]) && rows[i][j].push([0,1]);
        (j-1>-1) && (cells[i*rowCount + (j-1)].dataset.type === contentTypes[2]) && rows[i][j].push([-1, 0]);
        (rows[i][j].length === 0) && alert("Mos më lër një metan të vetmuar ashtu!! (╥﹏╥)");
      } 
      else if (type === contentTypes[3]) rows[i][j] = "|";
      else if (type === contentTypes[2]) rows[i][j] = "-";
    }
  }

  // Remove not empty rows
  rows = rows.filter(row => row.some(cell => cell.length !== 0));

  // Find not empty columns
  const j_index = rows.reduce((acc, row) => {
    row.forEach((cell, j) => {
      if (cell.length !== 0 && !acc.includes(j)) acc.push(j);
    }); return acc;
  }, []);

  // Remove empty columns and filter the other columns
  rows = rows.map(row => row.filter((_, j) => j_index.includes(j)));

  // Get the container to place the output
  const container = document.getElementById('half_formula');
  while (container.firstChild) {
    // Remove any previous childe of div
    container.removeChild(container.firstChild);
  }

  rows.forEach(row => { 
    // Create every element for each row
    const rowDiv = document.createElement('div');

    row.forEach(cell => {
      // Create the inner cell class to change
      let carbon = document.createElement('div');
      carbon.classList.add('carbon');

      let count = 4 - cell.length; // Get the connections

      // Do the appropriate action for each type of cell
      if (cell === "-") carbon.innerHTML += "&nbsp;-&nbsp;";
      else if (cell === "|") carbon.innerHTML += "&nbsp;|&nbsp;";
      else if (count === 4) carbon.innerHTML += "&nbsp;&nbsp;&nbsp;";
      else if (count === 0) carbon.innerHTML += "&nbsp;C&nbsp;";
      else if (count === 1) carbon.innerHTML += "C&nbsp;H";
      else carbon.innerHTML += `CH<sub>${count}</sub>`;

      rowDiv.appendChild(carbon);
    });
    container.appendChild(rowDiv);
  });

  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  console.log("---------------")///
  rows.forEach(row=>{//$$$$$$$$$$//
  const rowString=row.map(cell=>{//
  if(cell==="-")return" - ";//$$$//
  if(cell==="|")return" | ";//$$$//
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  let count=4-cell.length;//$$$$$//
  if(count===4)return"   ";//$$$$//
  if(count===1)return"C H";//$$$$//
  if(count===0)return" C ";//$$$$//
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  return`CH${count}`;//$$$$$$$$$$//
  }).join("");//$$$$$$$$$$$$$$$$$//
  console.log(rowString);});//$$$//
  console.log("---------------")///
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//

  // Remove lines with "|" from the Structure
  Structure = rows.filter(row => !row.includes('|'));

  // Get the indexes of "-" then remove from Structure
  let hLineIndex = []; // Array to store indexes of "-"
  Structure.forEach(row => row.forEach((val, i) => {
    if (val === "-" && !hLineIndex.includes(i)) {
      hLineIndex.push(i); // Save the index
  }}));

  // Filter out the "-" from every row
  hLineIndex.sort((a, b) => b - a);
  hLineIndex.forEach((index) => {
    Structure.forEach((row) => {
      row.splice(index, 1);
    });
  });

  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
  console.log("---------------");//
  for(let row of Structure){//$$$//
  console.log(row);}//$$$$$$$$$$$//
  console.log("---------------");//
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
}