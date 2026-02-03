const contentTypes = ['none', 'dot', 'horizontalLine', 'verticalLine'];
var rowCount = 10;
let activeCell = null; // Track which cell is currently being edited

document.addEventListener('DOMContentLoaded', () => {
  const memoryGrid = document.getElementById('memoryGrid');
  const rowSlider = document.getElementById("rowSlider");
  const menu = document.getElementById('selection-menu');

  rowSlider.addEventListener("input", function() {
    rowCount = parseInt(this.value);
    document.documentElement.style.setProperty('--rowCount', rowCount);

    while (memoryGrid.firstChild) {
      memoryGrid.removeChild(memoryGrid.firstChild);
    }

    for (let i = 0; i < rowCount * rowCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.type = 'none';
      cell.onclick = function(e) {
        showMenu(e, this);
      };
      memoryGrid.appendChild(cell);
    }
  });

  rowSlider.dispatchEvent(new Event('input'));

  // Hide menu if clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cell') && !e.target.closest('#selection-menu')) {
      menu.style.display = 'none';
    }
  });
});

function showMenu(event, cell) {
  activeCell = cell;
  const menu = document.getElementById('selection-menu');
  
  // 1. Show to calculate dimensions
  menu.style.display = 'flex';
  menu.style.visibility = 'hidden'; 

  const menuWidth = menu.offsetWidth;
  const screenWidth = window.innerWidth;
  
  // 2. Get Cell Position
  // This finds the exact coordinates of the cell on the screen
  const cellRect = cell.getBoundingClientRect();
  const cellCenterX = cellRect.left + window.scrollX + (cellRect.width / 2);
  const cellTopY = cellRect.top + window.scrollY;

  // 3. Calculate Snap Position (Centered above cell)
  let leftPos = cellCenterX - (menuWidth / 2);
  let topPos = cellTopY - 60; // Fixed distance above the cell

  // 4. Smart Constraints (Prevent off-screen bleed)
  const padding = 10;
  if (leftPos < padding) { leftPos = padding;
  } else if (leftPos + menuWidth > screenWidth - padding) {
    leftPos = screenWidth - menuWidth - padding;
  }

  // 5. Apply
  menu.style.left = `${leftPos}px`;
  menu.style.top = `${topPos}px`;
  menu.style.visibility = 'visible';
}

function selectType(typeIndex) {
  if (!activeCell) return;

  const newContentType = contentTypes[typeIndex];
  
  // Clear cell
  while (activeCell.firstChild) activeCell.removeChild(activeCell.firstChild);
  
  // Create the visual element inside the cell
  if (newContentType !== 'none') {
    const new_div = document.createElement('div');
    new_div.classList.add(newContentType);
    activeCell.appendChild(new_div);
  }

  activeCell.dataset.type = newContentType;
  document.getElementById('selection-menu').style.display = 'none';
}