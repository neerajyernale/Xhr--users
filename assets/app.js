const cl = console.log;

const nameControl = document.getElementById('name');
const UsernameControl = document.getElementById('username');
const emailControl = document.getElementById('email');
const contactControl = document.getElementById('contact');
const userContainer = document.getElementById('userContainer');
const form = document.getElementById('UserForm')
const addBtn =document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');

let userArr = [];


let  baseUrl = "https://jsonplaceholder.typicode.com";

function fetchUsers(){
    let xhr = new XMLHttpRequest();
    let postURL = `${baseUrl}/users`;
    

    xhr.open("GET",postURL);
    xhr.send();
   
    xhr.onload = function () {

        if(xhr.status>=200 && xhr.status<=299){
            userArr = JSON.parse(xhr.response);
            createTables(userArr);

        }else{
            cl('something went wrong');
        }
    };
    xhr.onerror = function (){
        cl("network error");
    }
}

fetchUsers();


function createTables(eve){
    let result = '';
    eve.forEach((user,i)=>{
        result+=`
        <tr id="${user.id}">
        <td>${userArr.length - i}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
         <td>
        <i onClick="onEdit(this)"
           class="fa-solid fa-pen-to-square fa-2x text-primary"
           role="button"></i>
      </td>

      <td>
        <i onClick="onRemove(this)"
           class="fa-solid fa-trash fa-2x text-danger"
           role="button"></i>
      </td>
        
        
        
        
        </tr>`
    });
    userContainer.innerHTML = result;
   
}




function onCreateTable(eve){
    eve.preventDefault();

    let newObj = {
        name:nameControl.value,
        username:UsernameControl.value,
        email:emailControl.value,
        phone:contactControl.value

    };
    userArr.push(newObj);
    let xhr = new XMLHttpRequest();
    let postURL = `${baseUrl}/users`;

    xhr.open('POST',postURL);
    xhr.setRequestHeader("content-Type", "application/json");
    xhr.send(JSON.stringify(newObj));


    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <=299){
            let response = JSON.parse(xhr.response);

            let tr = document.createElement('tr');
            tr.id  = response.id;

            tr.innerHTML = ` <td>${userArr.length}</td>
        <td>${newObj.name}</td>
        <td>${newObj.username}</td>
        <td>${newObj.email}</td>
        <td>${newObj.phone}</td>
         <td>
        <i onClick="onEdit(this)"
           class="fa-solid fa-pen-to-square fa-2x text-primary"
           role="button"></i>
      </td>

      <td>
        <i onClick="onRemove(this)"
           class="fa-solid fa-trash fa-2x text-danger"
           role="button"></i>
      </td>`;

       Swal.fire({
        title: `User Add with id ${response.id} successfully`,
        icon: "success",
        timer: 800,
        showConfirmButton: false,
      });
        userContainer.prepend(tr);
         form.reset();

        } else{
            cl("something went wrong");
        }
    };
     xhr.onerror = function () {
    cl("Network Error");
    };

}
form.addEventListener('submit',onCreateTable);


function onRemove(eve){
    let removeid = eve.closest('tr').id;

    let removeUrl = `${baseUrl}/users/${removeid}`;
    let xhr = new XMLHttpRequest();
    
    xhr.open("DELETE",removeUrl);
    xhr.send();
    
    
    xhr.onload = function (){
        if(xhr.status>=200 && xhr.status<=299){
            eve.closest('tr').remove();
            let allTrs = [...document.querySelectorAll('#userContainer tr')]
            allTrs.forEach((tr,i)=>{
                tr.children[0].textContent=i+1;
            });

            Swal.fire({
            title: "User deleted successfully",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
            });

        }else{
            cl("something went wrong");
        }
    };
     xhr.onerror = function () {
    cl("Network Error");
    };

}

function onEdit(eve){
    let editid = eve.closest('tr').id;
    localStorage.setItem('editid',editid);

    let editUrl = `${baseUrl}/users/${editid}`
    
    let xhr = new XMLHttpRequest();
    
    xhr.open("GET", editUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Autho", "Get Token form");
    xhr.send();


    xhr.onload = function (){
        if(xhr.status>=200 && xhr.status<=299){
            let editObj = JSON.parse(xhr.response);

            nameControl.value = editObj.name;
            UsernameControl.value = editObj.username;
            emailControl.value = editObj.email;
            contactControl.value = editObj.phone;
           
            
            
              addBtn.classList.add("d-none");
              updateBtn.classList.remove("d-none");
        }else{
            cl("Something went wrong");

        }

    };
     xhr.onerror = function () {
    cl("Network Error");
  };
}


function onUpdate(eve){
    eve.preventDefault();
    
    
    let updateid = localStorage.getItem('editid');
    
    let updateObj = {
         name:nameControl.value,
        username:UsernameControl.value,
        email:emailControl.value,
        phone:contactControl.value

    }
      let updateUrl = `${baseUrl}/users/${updateid}`;

       let xhr = new XMLHttpRequest();

        xhr.open("PUT", updateUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(updateObj));


        xhr.onload = function (){
        if (xhr.status >= 200 && xhr.status <= 299) {
            let tr = document.getElementById(updateid).children;
            tr[1].innerHTML = `${updateObj.name}`
            tr[2].innerHTML = `${updateObj.username}`
            tr[3].innerHTML = `${updateObj.email}`
            tr[4].innerHTML = `${updateObj.phone}`

              Swal.fire({
              title: "User updated successfully",
              icon: "success",
              timer: 800,
              showConfirmButton: false,
              });
                addBtn.classList.remove("d-none");
                updateBtn.classList.add("d-none");

               form.reset();

              localStorage.removeItem("editId");

        }else{
            cl("Something went wrong");
        }

};
xhr.onerror = function () {
    cl("Network Error");
  };


}

updateBtn.addEventListener('click',onUpdate);


