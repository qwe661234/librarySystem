
var bookDataFromLocalStorage = [];

$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"database"},
        {text:"網際網路",value:"internet"},
        {text:"應用系統整合",value:"system"},
        {text:"家庭保健",value:"home"},
        {text:"語言",value:"language"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy/MM/dd",
    });
    $("#window").kendoWindow({
        actions: [ "Minimize", "Maximize", "Close"],
        visible: false,
        width: 400 + "px",
        height: 600 + "px"
    });

    $("#openWindow").kendoButton({
        click: function () {
            $("#window").data("kendoWindow").center().open();
        }
    });

    $("#add_book").kendoButton({
        click: addBook
    });

    $("#modify_book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChangeInModify
    });
    $("#modify_bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd",
    });
    $("#modify_window").kendoWindow({
        actions: [ "Minimize", "Maximize", "Close"],
        visible: false,
        width: 400 + "px",
        height: 600 + "px"
    });

    $("#modify_book").kendoButton({
        click: modify
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template(`<div class='book-grid-toolbar'>
                                    <input class='book-grid-search' placeholder='我想要找......' type='text' onChange="filter(event)"/>
                                </div>`),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" },
            { command: { text: "編輯", click: modifyBook }, title: " ", width: "120px" }
        ]
    });
})

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
}

function onChange(){
    var img = document.querySelector(".book-image");
    img.src = `image/${$("#book_category").val()}.jpg`;
}

function onChangeInModify(){
    var img = document.querySelector(".modify-book-image");
    img.src = `image/${$("#modify_book_category").val()}.jpg`;
}

function deleteBook(event){
    bookDataFromLocalStorage.splice(event.target.parentNode.parentNode.firstChild.innerHTML - 1, 1);
    bookDataFromLocalStorage.forEach(function(ele, index){
        ele.BookId = index + 1;
    });
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    var grid = $("#book_grid").data("kendoGrid");
    grid.dataSource.read();
}

function modifyBook(event){
    var bookId = event.target.parentNode.parentNode.firstChild.innerHTML;
    var targetBook = bookDataFromLocalStorage[bookId - 1]; 
    $("#modify_book_id").val(bookId);
    $("#modify_book_name").val(targetBook.BookName);
    $("#modify_book_category").data("kendoDropDownList").text(targetBook.BookCategory);
    $("#modify_book_author").val(targetBook.BookAuthor);
    $("#modify_bought_datepicker").data("kendoDatePicker").value(new Date(targetBook.BookBoughtDate));
    onChangeInModify();
    $("#modify_window").data("kendoWindow").center().open();
}

function modify(){
    var bookId = $("#modify_book_id").val(); 
    bookDataFromLocalStorage[bookId - 1].BookName = $("#modify_book_name").val();
    bookDataFromLocalStorage[bookId - 1].BookCategory = $("#modify_book_category").data("kendoDropDownList").text();
    bookDataFromLocalStorage[bookId - 1].BookAuthor = $("#modify_book_author").val();
    bookDataFromLocalStorage[bookId - 1].BookBoughtDate = $("#modify_bought_datepicker").data("kendoDatePicker")._oldText;
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    var grid = $("#book_grid").data("kendoGrid");
    grid.dataSource.read();
    $("#modify_window").data("kendoWindow").close();
}

function addBook(){
    var bookId = bookDataFromLocalStorage.length + 1;
    var bookName = $("#book_name").val();
    var bookCategory = $("#book_category").data("kendoDropDownList").text();
    var bookAuthor = $("#book_author").val();
    var bookBoughtDate = $("#bought_datepicker").data("kendoDatePicker")._oldText;
    var newBook = new book(bookId, bookName, bookCategory, bookAuthor, bookBoughtDate);
    bookDataFromLocalStorage.push(newBook);
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    var grid = $("#book_grid").data("kendoGrid");
    grid.dataSource.read();
    $("#window").data("kendoWindow").close();
    $("#book_name").val("");
    $("#book_author").val("");
}

function book(bookId, bookName, bookCategory, bookAuthor, bookBoughtDate){
    this.BookId = bookId; 
    this.BookCategory = bookCategory;
    this.BookName = bookName;
    this.BookAuthor = bookAuthor;
    this.BookBoughtDate = bookBoughtDate;
}

function filter(event){
    var grid = $("#book_grid").data("kendoGrid");
    grid.dataSource.filter( { field: "BookName", operator: "contains", value: event.target.value });
}