const student_create_form = document.getElementById("student-create-form");
const Edite_student_form = document.getElementById("Edite_student_form");
const student_create_modal = document.getElementById("student-create");
const studentList = document.getElementById("student-data-list");
const msg = document.querySelector(".msg");
const btn_close = document.querySelector(".btn-close");
const close_btn = document.querySelector("#close_btn");
const singleStudentData = document.querySelector(".student-data");

/**
 * get all students data
 * @param {*} e
 */

const getAllStudents = () => {
  const students = JSON.parse(localStorage.getItem("student_data"));

  let dataList = "";

  if (students) {
    students.reverse().forEach((data, index) => {
      dataList += `
        <tr>
        <td>${index + 1}</td>
        <td>
          <img
            class="tbImg"
            src="${data.photo}"
            alt=""
          />
        </td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td>${data.className}</td>
        <td>${data.roll}</td>
        <td>
          <button
            class="btn btn-sm btn-info"
            data-bs-toggle="modal"
            data-bs-target="#single_show"
            onclick="singleStudent('${data.id}')"
          >
            <i class="fa fa-eye" ></i>
          </button>
          <button class="btn btn-sm btn-warning" 
          data-bs-toggle="modal"
          data-bs-target="#studentEdite"
          onclick="editeStudent('${data.id}')">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent('${
            data.id
          }')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
        `;
    });
  } else {
    dataList = `
        <tr>
            <td colspan="8" class="text-center text-danger">No data found</td>
        </tr>
    `;
  }
  studentList.innerHTML = dataList;
};

getAllStudents();

/**
 * Create Students
 */
student_create_form.onsubmit = (e) => {
  e.preventDefault();

  const form_data = new FormData(e.target);
  const { name, email, phone, className, roll, photo } = Object.fromEntries(
    form_data.entries()
  );

  if (!name || !email || !phone || !className || !roll || !photo) {
    msg.innerHTML = createAlert("All fields are required");
  } else if (!isEmail(email)) {
    msg.innerHTML = createAlert("Invalid Email Address", "warning");
  } else if (!isMobile(phone)) {
    msg.innerHTML = createAlert("Invalid Mobile Number", "warning");
  } else {
    //get old post

    let old_post = localStorage.getItem("student_data");

    let new_post = [];
    if (old_post) {
      new_post = JSON.parse(old_post);
    }

    new_post.push({
      id: createID(),
      name,
      email,
      phone,
      className,
      roll,
      photo,
      createAt: Date.now(),
    });

    localStorage.setItem("student_data", JSON.stringify(new_post));
    e.target.reset();
    getAllStudents();
    btn_close.click();
  }
};

const singleStudent = (id) => {
  const student_data = JSON.parse(localStorage.getItem("student_data"));

  student = student_data.find((item) => item.id === id);
  const { name, email, phone, className, roll, photo } = student;

  singleStudentData.innerHTML = `
  <div class="card">
  <div class="card-body">
    <img
      style="
        width: 100%;
        height: 300px;
        border-radius: 5px;
        object-fit: cover;
      "
      src="${photo}"
      alt=""
    />
    <h2>${name}</h2>
    <p>Email: ${email}</p>
    <p>Phone: ${phone}</p>
    <p>Class: ${className}</p>
    <p>Roll:  ${roll}</p>
  </div>
</div>
  
  `;
};

/**
 * delete Student
 * @param {*} id
 */
const deleteStudent = (id) => {
  console.log(id);
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary Students!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const students = JSON.parse(localStorage.getItem("student_data"));
      const update_students = students.filter((data) => data.id !== id);
      localStorage.setItem("student_data", JSON.stringify(update_students));
      getAllStudents();
      swal("Poof! Your imaginary Students! has been deleted!", {
        icon: "success",
      });
    } else {
      swal("Your imaginary Students! is safe!");
    }
  });
};

/**
 * update student
 * @param {*} id
 */
const editeStudent = (id) => {
  const students = JSON.parse(localStorage.getItem("student_data"));
  const { name, email, phone, className, roll, photo } = students.find(
    (data) => data.id === id
  );

  Edite_student_form.querySelector('input[placeholder="Name"]').value = name;
  Edite_student_form.querySelector('input[name="email"]').value = email;
  Edite_student_form.querySelector('input[name="phone"]').value = phone;
  Edite_student_form.querySelector('input[name="className"]').value = className;
  Edite_student_form.querySelector('input[name="roll"]').value = roll;
  Edite_student_form.querySelector('input[name="photo"]').value = photo;
  Edite_student_form.querySelector('input[name="id"]').value = id;
};

Edite_student_form.onsubmit = (e) => {
  e.preventDefault();
  const form_data = new FormData(e.target);
  const { name, email, phone, className, roll, photo, id } =
    Object.fromEntries(form_data);
  const students = JSON.parse(localStorage.getItem("student_data"));

  const updateStudent = students.map((item) => {
    if (item.id == id) {
      return {
        ...item,
        name,
        email,
        phone,
        className,
        roll,
        photo,
      };
    } else {
      return item;
    }
  });

  localStorage.setItem("student_data", JSON.stringify(updateStudent));
  getAllStudents();
  close_btn.click();
};
