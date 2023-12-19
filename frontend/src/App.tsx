import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal"; 

Modal.setAppElement("#root");

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [gender, setGender] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const [userData, setUserData] = useState<any>(null); 

  const [errors, setErrors] = useState({
    name: "",
    dob: "",
    mobile: "",
    batch: "",
    gender: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      name,
      dob,
      mobile,
      selectedBatch,
      gender,
    };

    //validation on frontend
    const nameRegex = /^[a-zA-Z\s]+$/;
    const validName = nameRegex.test(name);
    const currentDate = new Date();
    const userDOB = new Date(dob);
    const age = currentDate.getFullYear() - userDOB.getFullYear();
    const isValidDOB = age >= 18 && age <= 65;

    const newErrors = {
      name: !name || !validName ? "Please enter a valid name" : "",
      dob: !dob || !isValidDOB ? "You should be between 18 and 65 years" : "",
      mobile:
        !mobile || !/^\d{10}$/.test(mobile)
          ? "Please enter a valid 10-digit mobile number"
          : "",
      batch: !selectedBatch ? "Please select a batch" : "",
      gender: !gender ? "Please select gender" : "",
    };

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      // Continue if frontend validation passes
      try {
        const response = await axios.post(
          "http://localhost:5000/api/enroll",
          formData
        );

        if (response.status === 200) {
          setUserData(response.data.userData); 
          setIsOpen(true);
          console.log("Enrolled User Data:", response.data.userData);
          setTimeout(() => {
            setName("");
            setDob("");
            setMobile("");
            setSelectedBatch("");
            setGender("");
          }, 1000);
          setErrors({
            name: "",
            dob: "",
            mobile: "",
            batch: "",
            gender: "",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className='flex flex-row flex-nowrap gap-24'>
      <div className='max-w-md mx-auto w-full flex flex-col'>
        <div className='flex flex-col py-8'>
          <img
            src='./src/assets/primary_logo_black.png'
            alt=''
            className='w-60 object-cover'
          />
        </div>
        <h2 className='text-2xl mb-6 capitalize font-bold'>
          Sign Up for Weekly Yoga Classes
        </h2>
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-0'>
          <div className='mb-4'>
            <label className='block  '>Name:</label>
            {errors.name && <span className='error'>{errors.name}</span>}
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='form-input mt-1 block w-full'
            />
          </div>

          <div className='mb-4'>
            <label className='block'>Gender:</label>
            {errors.gender && <span className='error'>{errors.gender}</span>}
            <div className='flex flex-row gap-5'>
              <label className='text-xl capitalize font-normal text-black tracking-wide'>
                <input
                  type='radio'
                  value='male'
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className='form-radio'
                />
                <span className='ml-2'>Male</span>
              </label>
              <label className='text-xl capitalize font-normal text-black tracking-wide'>
                <input
                  type='radio'
                  value='female'
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className='form-radio'
                />
                <span className='ml-2'>Female</span>
              </label>
              <label className='text-xl capitalize font-normal text-black tracking-wide'>
                <input
                  type='radio'
                  value='other'
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.value)}
                  className='form-radio'
                />
                <span className='ml-2'>Other</span>
              </label>
            </div>
          </div>
          <div className='flex flex-row gap-5 w-full'>
            <div className='mb-4 w-1/3'>
              <label className='block  '>Date of Birth:</label>
              {errors.dob && <span className='error'>{errors.dob}</span>}
              <input
                type='date'
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className='form-input mt-1 block w-full'
              />
            </div>
            <div className='mb-4 w-2/3'>
              <label className='block'>Mobile Number:</label>
              {errors.mobile && <span className='error'>{errors.mobile}</span>}
              <input
                type='tel'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className='form-input mt-1 block w-full'
                pattern='[0-9]{10}'
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block'>Select Batch:</label>
            {errors.batch && <span className='error'>{errors.batch}</span>}
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className='form-select mt-1 block w-full'>
              <option value=''>Select a Batch</option>
              <option value='6-7AM'>6-7AM</option>
              <option value='7-8AM'>7-8AM</option>
              <option value='8-9AM'>8-9AM</option>
              <option value='5-6PM'>5-6PM</option>
            </select>
          </div>
          <button
            type='submit'
            className='bg-black hover:bg-slate-900 uppercase text-l tracking-widest text-white font-bold py-2 px-4 rounded-sm'>
            Enroll
          </button>
        </form>
      </div>
      <div>
        <div className='relative'>
          <img
            src='./src/assets/hero.jpg'
            alt=''
            className='w-full h-screen object-cover'
          />
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-80'></div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Success Modal'
        className='bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-lg shadow-lg'>
        <h2 className='text-green-800 text-3xl font-bold mb-5'>
          You have successfully enrolled!
        </h2>
        <p className='text-lg'>Name: {userData?.name}</p>
        <p className='text-lg'>Gender: {userData?.gender}</p>
        <p className='text-lg'>Date of Birth: {userData?.dob}</p>
        <p className='text-lg'>Mobile Number: {userData?.mobile}</p>
        <p className='text-lg'>Selected Batch: {userData?.selectedBatch}</p>

        <button
          className='bg-black text-white border-black border-2 p-2 mt-5'
          onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default App;
