const books = [];
const EVENT_READ = 'render-read';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';


function generatedId (){
     return + new Date();
}

function generatedBookObject(id,title,author,year, isComplated){
     return{
          id,
          title,
          author,
          year,
          isComplated,
     }
}

function addBook() {
     const textBook = document.getElementById('inputBookTitle').value;
     const textAuthor = document.getElementById('inputBookAuthor').value;
     const textYear = document.getElementById('inputBookYear').value;

     const generatedID = generatedId();
     const bookData = generatedBookObject(generatedID, textBook, textAuthor, textYear, false);

     books.push(bookData);

     document.dispatchEvent(new Event(EVENT_READ));

     saveBook();

     console.info(bookData);
}

document.addEventListener('DOMContentLoaded', function() {
     const submitBook = document.getElementById('inputBook');
     submitBook.addEventListener('submit', function(event){
          event.preventDefault();
          addBook();
     });

     if (isStorageExist()) {
          loadData();
        }
});


document.addEventListener(EVENT_READ, function() {
     const unComplateBooks = document.getElementById('incompleteBookshelfList');
     unComplateBooks.innerHTML ="";

     const complateBooks = document.getElementById('completeBookshelfList');
     complateBooks.innerHTML ="";

     const complateCheck = document.getElementById('inputBookIsComplete');
     complateCheck.innerHTML = "";

     for(const bookItems of books){
          const dataBook = createBook(bookItems);
          console.info(dataBook);
          if(!bookItems.isComplated)
               unComplateBooks.append(dataBook);
          else
               complateBooks.append(dataBook);  
          
     }

});

function createBook(bookData){
     const titleBook = document.createElement('h2');
     titleBook.innerText = bookData.title;

     const bookAuthor = document.createElement('p');
     bookAuthor.innerText = bookData.author;

     const bookYear = document.createElement('p');
     bookYear.innerText = bookData.year;

     const containerBox = document.createElement('div');
     containerBox.classList.add('book_item');
     containerBox.append(titleBook, bookAuthor, bookYear);

     const textBookData = document.createElement('div');
     textBookData.classList.add('book_list');
     textBookData.append(containerBox);

     const containerBook = document.createElement('div');
     containerBook.classList.add('book_shelf');
     containerBook.append(textBookData);
     containerBook.setAttribute('id', `book-${bookData.id}`);


     if(bookData.isComplated){

          const undoButton = document.createElement('button');
          undoButton.classList.add('green');
          undoButton.innerHTML="Belum Selesai Baca"
       
          undoButton.addEventListener('click', function () {
               undoBook(bookData.id);
          });

          const trashButton = document.createElement('button');
          trashButton.classList.add('red');
          trashButton.innerHTML ="Delete";
       
          trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookData.id);
          });

          const handle = document.createElement('div');
          handle.classList.add('action');
          handle.append(undoButton, trashButton);

          containerBox.append(handle);

        } else {

          const undoButton = document.createElement('button');
          undoButton.classList.add('green');
          undoButton.innerHTML="Selesai Baca"
       
          undoButton.addEventListener('click', function () {
               addBookComplated(bookData.id);
          });

          const trashButton = document.createElement('button');
          trashButton.classList.add('red');
          trashButton.innerHTML="Delete"
       
          trashButton.addEventListener('click', function () {
               removeBookFromCompleted(bookData.id);
          });

          const handle = document.createElement('div');
          handle.classList.add('action');
          handle.append(undoButton, trashButton);

          containerBox.append(handle);

     
        }

     return containerBook;
}



function findBook(bookId){
     for( const findBook of books){
          if(findBook.id === bookId){
               return findBook;
          }
     }
     return null;
}

function addBookComplated(bookId){
     const bookTarget = findBook(bookId);

     if(bookTarget == null) return;
     bookTarget.isComplated = true;
     document.dispatchEvent(new Event(EVENT_READ));

     saveBook();
}


function removeBookFromCompleted(bookId) {
     const bookTarget = findBookIndex(bookId);
    
     if (bookTarget === -1) return;
    
     books.splice(bookTarget, 1);
     document.dispatchEvent(new Event(EVENT_READ));

     saveBook();
   }

function undoBook(bookId){
     const bookTarget = findBook(bookId);

     if(bookTarget == null) return;
     bookTarget.isComplated = false;
     document.dispatchEvent(new Event(EVENT_READ));

     saveBook();
}

function findBookIndex(bookId){
     for(const index in books){
          if(books[index].id === bookId){
               return index;
          }
     }

     return -1;
}

function saveBook(){
     if(isStorageExist()){
          const parsed = JSON.stringify(books);
          localStorage.setItem(STORAGE_KEY, parsed);
          document.dispatchEvent(new Event(SAVED_EVENT));
     }
}

function isStorageExist(){
     if(typeof (Storage) === undefined){
          alert('Local Storage Tidak Support');

          return false;
     }

     return true;
}

document.addEventListener(SAVED_EVENT, function() {
     console.log(localStorage.getItem(STORAGE_KEY));
});



function loadData(){
     const serializaData = localStorage.getItem(STORAGE_KEY);

     let dataBooks =  JSON.parse(serializaData);


     if(dataBooks !== null){
          for(const book of dataBooks){
               books.push(book);
          }
     }

     document.dispatchEvent(new Event(EVENT_READ));

}