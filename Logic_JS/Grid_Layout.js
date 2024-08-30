const contentTypes = ['none', 'dot', 'horizontalLine', 'verticalLine'];
var rowCount = 10; // Variable for saving the row/column grid count

// As soon as the page is created
document.addEventListener('DOMContentLoaded', () => {
  const memoryGrid = document.getElementById('memoryGrid');
  //const rowCountLabel = document.getElementById("rowCount");
  const rowSlider = document.getElementById("rowSlider");

  rowSlider.addEventListener("input", function() {
    rowCount = parseInt(this.value);

    // Update CSS variable value
    document.documentElement.style.setProperty('--rowCount', rowCount);

    while (memoryGrid.firstChild) { // Clear section
      memoryGrid.removeChild(memoryGrid.firstChild);
    }

    for (let i = 0; i < rowCount * rowCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.type = 'none';
      cell.onclick = function() {
        toggleContent(this);
      }; // Add Cell to the grid
      memoryGrid.appendChild(cell);
    }
  });

  // Initialize grid with default row count
  rowSlider.dispatchEvent(new Event('input'));
});


function toggleContent(cell) { // Change the state when clciked
  let currentIndex = contentTypes.indexOf(cell.dataset.type);
  let newIndex = (currentIndex + 1) % contentTypes.length;

  // Remove every previus child from the cell in html
  while (cell.firstChild) cell.removeChild(cell.firstChild);
        
  // Create the new child with a div
  const new_div = document.createElement('div');
  let newContentType = contentTypes[newIndex];

  // Change the classType if verticalLine
  if (newContentType === contentTypes[3]) {
    new_div.classList.add(contentTypes[3]);
  } else if ( // --||-- if horizontal
    newContentType === contentTypes[2]) {
    new_div.classList.add(contentTypes[2]);
  } else if ( // --||-- if dot
    newContentType === contentTypes[1]) {
    new_div.classList.add(contentTypes[1]);
  } 
      
  // Add the child to div
  cell.appendChild(new_div);
  cell.dataset.type = contentTypes[newIndex];
}