// import React, { useEffect, useState } from 'react';
// import './AddLink.css';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import withAuth from '../../withAuth';
// import { useNavigate, Link, useParams,useLocation } from 'react-router-dom';

// const AddLink = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [selectedProfiles, setSelectedProfiles] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [showProfileOptions, setShowProfileOptions] = useState(false);
//   const [showSkillOptions, setShowSkillOptions] = useState(false);

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const params = new URLSearchParams(location.search);
//   const decision_name = params.get('name');


//   const fetchProfiles = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/data/master-profiles`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setProfiles(response.data.profiles);
//     } catch (err) {
//       console.log('Error fetching profile data:', err);
//     }
//   };

//   const fetchSkills = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/skill/master-skills`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSkills(response.data.skills);
//     } catch (err) {
//       console.log('Error fetching skill data:', err);
//     }
//   };

//   useEffect(() => {
//     fetchProfiles();
//     fetchSkills();
//   }, [id]);

//   const handleSWOTClick = () => {
//     setShowProfileOptions(!showProfileOptions);
//   };

//   const handleSoftSkillClick = () => {
//     setShowSkillOptions(!showSkillOptions);
//   };

//   const handleProfileChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedProfiles([...selectedProfiles, value]);
//     } else {
//       setSelectedProfiles(selectedProfiles.filter((id) => id !== value));
//     }
//   };

//   const handleSkillChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedSkills([...selectedSkills, value]);
//     } else {
//       setSelectedSkills(selectedSkills.filter((id) => id !== value));
//     }
//   };

//   const handleProfileSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/links`, {
//         v_ids: selectedProfiles,
//         decision_id: id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Profiles Linked Successfully");
//       navigate('/getall');
//     } catch (err) {
//       console.log('Error linking profiles:', err);
//       toast.error("Error adding profile link");
//     }
//   };

//   const handleSkillSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/link`, {
//         skill_ids: selectedSkills,
//         decision_id: id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Skill link added successfully");
//       navigate('/getall');
//     } catch (err) {
//       console.error('Error adding skill link:', err);
//       toast.error("Error adding skill link");
//     }
//   };

//   return (
//     <div className='addlink'>
//         <center>
//         <div className='bg-secondary text-white rounded p-2'>
//         <h4>{decision_name}</h4>
//         <input
//           type="text"
//           placeholder="Decision Name"
//           value={id}
//           readOnly
//         />
//         </div>
//         </center>
//       <div>
//         <div>
//           <button type="button" className='swot' onClick={handleSWOTClick}>SWOT Analysis</button>
//           {showProfileOptions && (
//             <div className='options'>
//               {profiles.map((profile) => (
//                 <div key={profile.header_id}>
//                   <label htmlFor={`profile-${profile.header_id}`}>
//                     <input
//                       type="checkbox"
//                       id={`profile-${profile.header_id}`}
//                       value={profile.header_id}
//                       onChange={handleProfileChange}
//                     />
//                     {profile.header_name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button type='submit' onClick={handleProfileSubmit} className='savebtn'>Save SWOT Link</button>
//       </div>
//       <div>
//         <div>
//           <button type='button' className='soft-skill' onClick={handleSoftSkillClick}>Soft-Skills Analysis</button>
//           {showSkillOptions && (
//             <div className='options-container'>
//               {skills.map((skill) => (
//                 <div key={skill.skill_id}>
//                   <label htmlFor={`skill-${skill.skill_id}`}>
//                     <input
//                       type="checkbox"
//                       id={`skill-${skill.skill_id}`}
//                       value={skill.skill_id}
//                       onChange={handleSkillChange}
//                     />
//                     {skill.skill_name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button type='submit' className='savebtn' onClick={handleSkillSubmit}>Save Soft-Skill Link</button>
//       </div>
//       <div>
//         <Link to='/getall'>
//           <button className='getpage'>
//             Go to GetLink Page
//           </button>
//         </Link>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default withAuth(AddLink);


import React, { useEffect, useState } from 'react';
import './AddLink.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '../../withAuth';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';

const AddLink = () => {
  const [profiles, setProfiles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showSkillOptions, setShowSkillOptions] = useState(false);
  const [attitude, setAttitude] = useState([]);
  const [strength, setStrength] = useState([]);
  const [weakness, setWeakness] = useState([]);
  const [opportunity, setOpportunity] = useState([]);
  const [threat, setThreat] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const decision_name = params.get('name');

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched profiles data:', response.data);

      // Ensure profiles is an array
      setProfiles(Array.isArray(response.data.profiles) ? response.data.profiles : []);
      setAttitude(Array.isArray(response.data.attitude) ? response.data.attitude : []);
      setStrength(Array.isArray(response.data.strength) ? response.data.strength : []);
      setWeakness(Array.isArray(response.data.weakness) ? response.data.weakness : []);
      setOpportunity(Array.isArray(response.data.opportunity) ? response.data.opportunity : []);
      setThreat(Array.isArray(response.data.threat) ? response.data.threat : []);
    } catch (err) {
      console.log('Error fetching profile data:', err);
      setProfiles([]);
      setAttitude([]);
      setStrength([]);
      setWeakness([]);
      setOpportunity([]);
      setThreat([]);
    }
  };

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/skill/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data.skills || []);
      setShowSkillOptions(true);
      console.log('Fetched skills data:', response.data.skills);
    } catch (err) {
      console.log('Error fetching skill data:', err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchSkills();
  }, [id]);

  const handleSWOTClick = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  const handleSoftSkillClick = () => {
    setShowSkillOptions(!showSkillOptions);
    if (!showSkillOptions) {
      fetchSkills();
    }
  };

  const handleProfileChange = (e) => {
    const { value, checked } = e.target;
    setSelectedProfiles((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSkills((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/links`, {
        v_ids: selectedProfiles,
        decision_id: id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profiles Linked Successfully");
      navigate('/getall');
    } catch (err) {
      console.log('Error linking profiles:', err);
      toast.error("Error adding profile link");
    }
  };


  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/link`, {
        skill_ids: selectedSkills,
        decision_id: id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Skill link added successfully");
      navigate('/getall');
    } catch (err) {
      console.error('Error adding skill link:', err);
      toast.error("Error adding skill link");
    }
  };

  return (
      <div className='addlink'>
      <center>
        <div className='bg-secondary text-white rounded p-2'>
          <h4>{decision_name}</h4>
          <input
            type="text"
            placeholder="Decision Name"
            value={id}
            readOnly
          />
        </div>
      </center>
      <div>
        <div>
          <div className='d-flex gap-2' style={{maxWidth:'400px'}}>
            <IoIosInformationCircle className='fs-4' />
            <p> To link your decisions to your Profile data like SWOT, please click "Get Profile Data" </p>
          </div>
          <button type="button" className='swot' onClick={handleSWOTClick}>Get Profile Data</button>
          {showProfileOptions && (
            <div className='options'>
              {Array.isArray(profiles) && profiles.map((profile) => (
                <div key={profile.header_id}>
                  <label htmlFor={`profile-${profile.header_id}`}>
                    <input
                      type="checkbox"
                      id={`profile-${profile.header_id}`}
                      value={profile.header_id}
                      onChange={handleProfileChange}
                    />
                    {profile.header_name}
                  </label>
                </div>
              ))}
              <div className='swot-list ml-3'>
                <h5>Attitude</h5>
                <div className='checkbox-container'>
                  {Array.isArray(attitude) && attitude.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        onChange={handleProfileChange}
                        value={item.id}
                      />
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <h5>Strength</h5>
                <div className='checkbox-container'>
                  {Array.isArray(strength) && strength.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        onChange={handleProfileChange}
                        value={item.id}
                      />
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <h5>Weakness</h5>
                <div className='checkbox-container'>
                  {Array.isArray(weakness) && weakness.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        onChange={handleProfileChange}
                        value={item.id}
                      />
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <h5>Opportunity</h5>
                <div className='checkbox-container'>
                  {Array.isArray(opportunity) && opportunity.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        onChange={handleProfileChange}
                        value={item.id}
                      />
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <h5>Threat</h5>
                <div className='checkbox-container'>
                  {Array.isArray(threat) && threat.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        onChange={handleProfileChange}
                        value={item.id}
                      />
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button type='submit' onClick={handleProfileSubmit} className='savebtn'>Save SWOT Link</button>
      </div>
      <div>
        <div>
          <div className='d-flex gap-2' style={{maxWidth:'400px'}}>
          <IoIosInformationCircle className='fs-4' />
          <p> To link your decisions to your Soft Skills, please click Get Soft Skills Data" </p>
          </div>
          <button type='button' className='soft-skill' onClick={handleSoftSkillClick}>Get Soft Skills Data</button>
          {showSkillOptions && (
            <div className='options-container ml-3'>
              {Array.isArray(skills) && skills.map((skill) => (
                <div key={skill.skill_id}>
                  <label htmlFor={`skill-${skill.skill_id}`}>
                    <input
                      type="checkbox"
                      id={`skill-${skill.skill_id}`}
                      value={skill.skill_id}
                      onChange={handleSkillChange}
                    />
                    <strong>{skill.skill_name}</strong><br />
                    <span>Rating: {skill.rating}</span><br />
                    <span>Comments: {skill.comments}</span><br />
                    <span>Description: {skill.description} </span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type='submit' className='savebtn' onClick={handleSkillSubmit}>Save Soft-Skill Link</button>
      </div>
      <div>
        <div className='d-flex gap-2'style={{maxWidth:'400px'}}>
        <IoIosInformationCircle className='fs-4' />
        <p> To link your decisions to your Profile data like SWOT, please click "Get Profile Data" </p>
        </div>
        <Link to='/getall'>
          <button className='getpage'>
            View Linked Decisions
          </button>
        </Link>
      </div>
      <ToastContainer />
      </div>   
  );
};

export default withAuth(AddLink);
