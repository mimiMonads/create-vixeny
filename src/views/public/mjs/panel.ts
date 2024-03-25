interface Item {
    id: string;
    name: string;
    price: number;
  }
  
const server = "http://localhost:3000/"


  function reload(): void {
    fetch(new Request( server + "api/crud/getAll"), {
      method: "POST",
    }).then((res) => res.json())
      .then((items: Item[]) => fillItemsTable(items))
      .catch( e => console.log(e))
  }
  
  reload();
  
  function fillItemsTable(items: Item[]): void {
    const tableBody = document.getElementById("itemsTable")!.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing content
  
    items.forEach((item) => {
      let row = tableBody.insertRow();
      let idCell = row.insertCell(0);
      let nameCell = row.insertCell(1);
      let priceCell = row.insertCell(2);
      let actionCell = row.insertCell(3);
  
      idCell.textContent = item.id;
      nameCell.textContent = item.name;
      priceCell.textContent = `$${item.price.toFixed(2)}`;
  
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteItem(item.id);
      actionCell.appendChild(deleteButton);
    });
  }
  
  function showUpdateForm(itemId: string, itemName: string, itemPrice: number): void {
    (document.getElementById("updateItemId") as HTMLInputElement).value = itemId;
    (document.getElementById("updateItemName") as HTMLInputElement).value = itemName;
    (document.getElementById("updateItemPrice") as HTMLInputElement).value = itemPrice.toString();
    (document.getElementById("addItemForm") as HTMLElement).style.display = "none";
  }
  
  function deleteItem(itemId: string): void {
    if (confirm("Are you sure you want to delete this item?")) {
      fetch(new Request( server +`api/crud/delete/${itemId}`, {
        method: "POST",
      }))
        .then(() => reload());
    }
  }
  