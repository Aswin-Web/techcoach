const getConnection = require('../Models/database');
const crypto = require('crypto');


const getUserList = async (req, res) => {
  let conn;
  try {
    const userId = req.user.id;

    conn = await getConnection();
    await conn.beginTransaction();


    const tasks = await conn.query(`
        SELECT * FROM techcoach_lite.techcoach_users WHERE user_id = ?;
      `, [userId]);

    await conn.commit();

    res.status(200).json({ message: 'User List Fetched successfully', tasks });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (conn) conn.release();
  }
};


// const postGeneralProfile = async (req, res) => {
//   const { dob, communication, skill, attitude, strength, weakness, opportunity, threat } = req.body;
//   console.log(req.body, 'General Profile Data');

//   let conn;
//   try {
//     conn = await getConnection();
//     await conn.beginTransaction();

//     const userId = req.user.id;
//     console.log("User ID from getUserList:", userId);

//     const currentDate = new Date().toISOString().slice(0, 10);
//     console.log("Current Date:", currentDate);

//     const encryptText = (text, key) => {
//       const cipher = crypto.createCipher('aes-256-cbc', key);
//       let encryptedText = cipher.update(text, 'utf8', 'hex');
//       encryptedText += cipher.final('hex');
//       return encryptedText;
//     }

//     const res1 = await conn.query(
//       "INSERT INTO techcoach_lite.techcoach_personal_info (dob, user_id) VALUES (?, ?)",
//       [dob, userId]
//     );

//     console.log("res1", res1);

//     const headersAndValues = [
//       { headerName: 'Skill', headerValue: skill },
//       { headerName: 'Communication', headerValue: communication },
//       { headerName: 'Attitude', headerValue: attitude },
//       { headerName: 'Strength', headerValue: strength },
//       { headerName: 'Weakness', headerValue: weakness },
//       { headerName: 'Opportunity', headerValue: opportunity },
//       { headerName: 'Threat', headerValue: threat }
//     ];

//     for (const { headerName, headerValue } of headersAndValues) {
//       if (headerValue && headerValue.length > 0) {
//         const headerRows = await conn.query(
//           "SELECT header_id FROM techcoach_lite.techcoach_profile_swot_headers WHERE header_name = ?",
//           [headerName]
//         );

//         const headerId = headerRows[0]?.header_id;

//         console.log("header idddddddd", headerId);

//         if (!headerId) {
//           throw new Error(`Header ID not found for header name: ${headerName}`);
//         }

//         if (Array.isArray(headerValue)) {
//           for (const value of headerValue) {
//             const encryptedValue = encryptText(value, req.user.key);
//             await conn.query(
//               "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
//               [userId, headerId, encryptedValue]
//             );
//           }
//         } else {
//           const encryptedValue = encryptText(headerValue, req.user.key);
//           await conn.query(
//             "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
//             [userId, headerId, encryptedValue]
//           );
//         }
//       }
//     }

//     await conn.commit();
//     res.status(200).json({ message: 'General profile data inserted successfully' });
//   } catch (error) {
//     console.error('Error inserting general profile data:', error);
//     if (conn) {
//       await conn.rollback();
//     }
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   } finally {
//     if (conn) conn.release();
//   }
// };

const postGeneralProfile = async (req, res) => {
  const { attitude, strength, weakness, opportunity, threat } = req.body;

  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    const userId = req.user.id;

    const currentDate = new Date().toISOString().slice(0, 10);

    const encryptText = (text, key) => {
      const cipher = crypto.createCipher('aes-256-cbc', key);
      let encryptedText = cipher.update(text, 'utf8', 'hex');
      encryptedText += cipher.final('hex');
      return encryptedText;
    }

    const headersAndValues = [
      { headerName: 'Attitude', headerValue: attitude },
      { headerName: 'Strength', headerValue: strength },
      { headerName: 'Weakness', headerValue: weakness },
      { headerName: 'Opportunity', headerValue: opportunity },
      { headerName: 'Threat', headerValue: threat }
    ];

    for (const { headerName, headerValue } of headersAndValues) {
      if (headerValue && headerValue.length > 0) {
        const headerRows = await conn.query(
          `SELECT header_id FROM techcoach_lite.techcoach_profile_swot_headers WHERE header_name = ? AND type_of_profile = 'Profile'`,
          [headerName]
        );

        const headerId = headerRows[0]?.header_id;

        if (!headerId) {
          throw new Error(`Header ID not found for header name: ${headerName}`);
        }

        if (Array.isArray(headerValue)) {
          for (const value of headerValue) {
            const encryptedValue = encryptText(value, req.user.key);
            await conn.query(
              "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
              [userId, headerId, encryptedValue]
            );
          }
        } else {
          const encryptedValue = encryptText(headerValue, req.user.key);
          await conn.query(
            "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
            [userId, headerId, encryptedValue]
          );
        }
      }
    }

    await conn.commit();
    res.status(200).json({ message: 'General profile data inserted successfully' });
  } catch (error) {
    console.error('Error inserting general profile data:', error);
    if (conn) {
      await conn.rollback();
    }
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (conn) conn.release();
  }
};


const getMasterProfiles = async (req,res) => {
  let conn;
  try {
    conn = await getConnection();
    const rows = await conn.query("SELECT header_id ,header_name FROM techcoach_lite.techcoach_profile_swot_headers WHERE type_of_profile = 'Profile' ");
    
    if (rows.length > 0) {
      res.status(200).json({profiles : rows })
    } else {
      res.status(404).json({ message: 'No profiles found' });
    }
  } catch (error) {
    console.log('Error fetching master profiles:',error);
    res.status(500).json({ error:'An error occured while fetching master profiles'});
  } finally {
    if (conn) conn.release();
  }
}


const decryptText = (encryptedText, key) => {
  if (!encryptedText) return null;
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
  decryptedText += decipher.final('utf8');
  return decryptedText;
};


// const getProfile = async (req, res) => {
//   const userId = req.user.id;
//   const userKey = req.user.key;
//   console.log(userId);
//   let conn;

//   try {
//     conn = await getConnection();

//     const personalInfoResult = await conn.query(
//       "SELECT dob, created_at FROM techcoach_lite.techcoach_personal_info WHERE user_id = ?",
//       [userId]
//     );

//     if (personalInfoResult.length === 0) {
//       return res.status(404).json({ message: 'User profile not found' });
//     }

//     const personalInfo = personalInfoResult[0];

//     // Query to get the header names and ids
//     const headerNamesResult = await conn.query(
//       "SELECT header_id, header_name FROM techcoach_lite.techcoach_profile_swot_headers"
//     );

//     const headerMap = headerNamesResult.reduce((acc, { header_id, header_name }) => {
//       acc[header_name.toLowerCase()] = header_id;
//       return acc;
//     }, {});

//     // Query to get the header values for the user
//     const headerValuesResult = await conn.query(
//       `SELECT v.id, h.header_name, v.header_value 
//       FROM techcoach_lite.techcoach_profile_swot_values v 
//       JOIN techcoach_lite.techcoach_profile_swot_headers h ON v.header_id = h.header_id 
//       WHERE v.user_id = ?`,
//       [userId]
//     );

//     const profileDetails = headerValuesResult.reduce((acc, { id, header_name, header_value }) => {
//       const key = header_name.toLowerCase();
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       const decryptedValue = decryptText(header_value, userKey);
//       acc[key].push({ id, value: decryptedValue });
//       return acc;
//     }, {});

//     const fullProfile = {
//       dob: personalInfo.dob,
//       user_id: userId,
//       ...profileDetails
//     };

//     res.status(200).json(fullProfile);
//   } catch (error) {
//     console.error('Error retrieving profile data:', error);
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   } finally {
//     if (conn) conn.release();
//   }
// };


const getProfile = async (req, res) => {
  const userId = req.user.id;
  const userKey = req.user.key;
  let conn;

  try {
    conn = await getConnection();

    // Query to get the header names and ids
    const headerNamesResult = await conn.query(
      "SELECT header_id, header_name FROM techcoach_lite.techcoach_profile_swot_headers WHERE type_of_profile = 'Profile'"
    );

    const headerMap = headerNamesResult.reduce((acc, { header_id, header_name }) => {
      acc[header_name.toLowerCase()] = header_id;
      return acc;
    }, {});

    // Query to get the header values for the user
    const headerValuesResult = await conn.query(
      `SELECT v.id, h.header_name, v.header_value 
      FROM techcoach_lite.techcoach_profile_swot_values v 
      JOIN techcoach_lite.techcoach_profile_swot_headers h ON v.header_id = h.header_id 
      WHERE v.user_id = ? AND h.type_of_profile = 'Profile'`,
      [userId]
    );

    const profileDetails = headerValuesResult.reduce((acc, { id, header_name, header_value }) => {
      const key = header_name.toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      const decryptedValue = decryptText(header_value, userKey);
      acc[key].push({ id, value: decryptedValue });
      return acc;
    }, {});

    const fullProfile = {
      user_id: userId,
      ...profileDetails
    };

    res.status(200).json(fullProfile);
  } catch (error) {
    console.error('Error retrieving profile data:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (conn) conn.release();
  }
};


// const putProfile = async (req, res) => {
//   const { dob, communication, skill, attitude, strength, weakness, opportunity, threat } = req.body;
//   const userKey = req.user.key;
//   console.log(req.body, 'Update General Profile Data');

//   let conn;
//   try {
//     conn = await getConnection();
//     await conn.beginTransaction();

//     // Validate User ID:
//     const userId = req.user.id;
//     console.log("User ID from getUserList:", userId);

//     const encryptText = (text, key) => {
//       const cipher = crypto.createCipher('aes-256-cbc', key);
//       let encryptedText = cipher.update(text, 'utf8', 'hex');
//       encryptedText += cipher.final('hex');
//       return encryptedText;
//     };

//     // Update Personal Info:
//     const updatePersonalInfoResult = await conn.query(
//       "UPDATE techcoach_lite.techcoach_personal_info SET dob = ? WHERE user_id = ?",
//       [dob, userId]
//     );
//     console.log("updatePersonalInfoResult", updatePersonalInfoResult);

//     // Process Header and Values:
//     const headersAndValues = [
//       { headerName: 'Skill', headerValue: skill },
//       { headerName: 'Communication', headerValue: communication },
//       { headerName: 'Attitude', headerValue: attitude },
//       { headerName: 'Strength', headerValue: strength },
//       { headerName: 'Weakness', headerValue: weakness },
//       { headerName: 'Opportunity', headerValue: opportunity },
//       { headerName: 'Threat', headerValue: threat }
//     ];

//     for (const { headerName, headerValue } of headersAndValues) {
//       if (headerValue && headerValue.length > 0) {
//         const headerRows = await conn.query(
//           "SELECT header_id FROM techcoach_lite.techcoach_profile_swot_headers WHERE header_name = ? AND type_of_profile = 'Profile' ",
//           [headerName]
//         );

//         const headerId = headerRows[0]?.header_id;

//         console.log("header id", headerId);

//         if (!headerId) {
//           throw new Error(`Header ID not found for header name: ${headerName}`);
//         }

//         // Retrieve existing header values and their row_ids for the user and header
//         const existingHeaderValues = await conn.query(
//           "SELECT id, header_value FROM techcoach_lite.techcoach_profile_swot_values WHERE user_id = ? AND header_id = ?",
//           [userId, headerId]
//         );

//         const existingHeaderValuesMap = existingHeaderValues.reduce((acc, { id, header_value }) => {
//           acc[header_value] = id;
//           return acc;
//         }, {});

//         // Prepare an array to store encrypted values to be deleted
//         const valuesToDelete = [];

//         // Insert new values and update existing ones
//         if (Array.isArray(headerValue)) {
//           for (const value of headerValue) {
//             // Check if value is a string and not empty
//             if (typeof value === 'string' && value.trim() !== '') {
//               const encryptedValue = encryptText(value, userKey);
//               if (existingHeaderValuesMap[encryptedValue]) {
//                 // Update existing value
//                 delete existingHeaderValuesMap[encryptedValue]; // Remove the value from the map
//                 await conn.query(
//                   "UPDATE techcoach_lite.techcoach_profile_swot_values SET header_value = ? WHERE id = ?",
//                   [encryptedValue, existingHeaderValuesMap[encryptedValue]]
//                 );
//               } else {
//                 // Insert new value
//                 await conn.query(
//                   "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
//                   [userId, headerId, encryptedValue]
//                 );
//               }
//             }
//           }
//         } else {
//           // Check if headerValue is a string and not empty
//           if (typeof headerValue === 'string' && headerValue.trim() !== '') {
//             const encryptedValue = encryptText(headerValue, userKey);
//             if (existingHeaderValuesMap[encryptedValue]) {
//               // Update existing value
//               delete existingHeaderValuesMap[encryptedValue]; // Remove the value from the map
//               await conn.query(
//                 "UPDATE techcoach_lite.techcoach_profile_swot_values SET header_value = ? WHERE id = ?",
//                 [encryptedValue, existingHeaderValuesMap[encryptedValue]]
//               );
//             } else {
//               // Insert new value
//               await conn.query(
//                 "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
//                 [userId, headerId, encryptedValue]
//               );
//             }
//           }
//         }

//         // Add remaining values in the map to the delete array
//         valuesToDelete.push(...Object.values(existingHeaderValuesMap));
        
//         // Delete removed values from the database
//         if (valuesToDelete.length > 0) {
//           await conn.query(
//             "DELETE FROM techcoach_lite.techcoach_profile_swot_values WHERE id IN (?)",
//             [valuesToDelete]
//           );
//         }
//       }
//     }

//     await conn.commit();
//     res.status(200).json({ message: 'General profile data updated successfully' });
//   } catch (error) {
//     console.error('Error updating general profile data:', error);
//     if (conn) {
//       await conn.rollback();
//     }
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   } finally {
//     if (conn) conn.release();
//   }
// };


/* const putProfile = async (req, res) => {
  console.log("reqbdy", req.body)
  const { attitude, strength, weakness, opportunity, threat } = req.body;
  const userKey = req.user.key;

  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    // Validate User ID:
    const userId = req.user.id;

    const encryptText = (text, key) => {
      const cipher = crypto.createCipher('aes-256-cbc', key);
      let encryptedText = cipher.update(text, 'utf8', 'hex');
      encryptedText += cipher.final('hex');
      return encryptedText;
    };

    // Process Header and Values:
    const headersAndValues = [
      { headerName: 'Attitude', headerValue: attitude },
      { headerName: 'Strength', headerValue: strength },
      { headerName: 'Weakness', headerValue: weakness },
      { headerName: 'Opportunity', headerValue: opportunity },
      { headerName: 'Threat', headerValue: threat }
    ];

    for (const { headerName, headerValue } of headersAndValues) {
      if (headerValue && headerValue.length > 0) {
        const headerRows = await conn.query(
          "SELECT header_id FROM techcoach_lite.techcoach_profile_swot_headers WHERE header_name = ? AND type_of_profile = 'Profile' ",
          [headerName]
        );

        const headerId = headerRows[0]?.header_id;

        if (!headerId) {
          throw new Error(`Header ID not found for header name: ${headerName}`);
        }

        // Retrieve existing header values and their row_ids for the user and header
        const existingHeaderValues = await conn.query(
          "SELECT id, header_value FROM techcoach_lite.techcoach_profile_swot_values WHERE user_id = ? AND header_id = ?",
          [userId, headerId]
        );

        const existingHeaderValuesMap = existingHeaderValues.reduce((acc, { id, header_value }) => {
          acc[header_value] = id;
          return acc;
        }, {});

        // Prepare an array to store encrypted values to be deleted
        const valuesToDelete = [];

        // Insert new values and update existing ones
        if (Array.isArray(headerValue)) {
          for (const value of headerValue) {
            // Check if value is a string and not empty
            if (typeof value === 'string' && value.trim() !== '') {
              const encryptedValue = encryptText(value, userKey);
              if (existingHeaderValuesMap[encryptedValue]) {
                // Update existing value
                delete existingHeaderValuesMap[encryptedValue]; // Remove the value from the map
                await conn.query(
                  "UPDATE techcoach_lite.techcoach_profile_swot_values SET header_value = ? WHERE id = ?",
                  [encryptedValue, existingHeaderValuesMap[encryptedValue]]
                );
              } else {
                // Insert new value
                await conn.query(
                  "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
                  [userId, headerId, encryptedValue]
                );
              }
            }
          }
        } else {
          // Check if headerValue is a string and not empty
          if (typeof headerValue === 'string' && headerValue.trim() !== '') {
            const encryptedValue = encryptText(headerValue, userKey);
            if (existingHeaderValuesMap[encryptedValue]) {
              // Update existing value
              delete existingHeaderValuesMap[encryptedValue]; // Remove the value from the map
              await conn.query(
                "UPDATE techcoach_lite.techcoach_profile_swot_values SET header_value = ? WHERE id = ?",
                [encryptedValue, existingHeaderValuesMap[encryptedValue]]
              );
            } else {
              // Insert new value
              await conn.query(
                "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
                [userId, headerId, encryptedValue]
              );
            }
          }
        }

        // Add remaining values in the map to the delete array
        valuesToDelete.push(...Object.values(existingHeaderValuesMap));
        
        // Delete removed values from the database
        if (valuesToDelete.length > 0) {
          await conn.query(
            "DELETE FROM techcoach_lite.techcoach_profile_swot_values WHERE id IN (?)",
            [valuesToDelete]
          );
        }
      }
    }

    await conn.commit();
    res.status(200).json({ message: 'General profile data updated successfully' });
  } catch (error) {
    console.error('Error updating general profile data:', error);
    if (conn) {
      await conn.rollback();
    }
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (conn) conn.release();
  }
}; */

const putProfile = async (req, res) => {
  console.log("reqbdy", req.body);
  const { attitude, strength, weakness, opportunity, threat } = req.body;
  const userKey = req.user.key;
  const userId = req.user.id;

  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    const encryptText = (text, key) => {
      const cipher = crypto.createCipher('aes-256-cbc', key);
      let encryptedText = cipher.update(text, 'utf8', 'hex');
      encryptedText += cipher.final('hex');
      return encryptedText;
    };

    const allValues = [
      ...attitude.map(item => ({ ...item, headerName: 'attitude' })),
      ...strength.map(item => ({ ...item, headerName: 'strength' })),
      ...weakness.map(item => ({ ...item, headerName: 'weakness' })),
      ...opportunity.map(item => ({ ...item, headerName: 'opportunity' })),
      ...threat.map(item => ({ ...item, headerName: 'threat' }))
    ];

    const existingItems = await conn.query(
      "SELECT id, header_value FROM techcoach_lite.techcoach_profile_swot_values WHERE user_id = ?",
      [userId]
    );

    const itemsToUpdate = [];
    const itemsToInsert = [];
    const itemsToDelete = new Set(existingItems.map(item => item.id));

    for (const item of allValues) {
      if (item.id) {
        const encryptedValue = encryptText(item.value, userKey);
        itemsToUpdate.push({ id: item.id, value: encryptedValue }); 
        itemsToDelete.delete(item.id); 
      } else if (item.id === null) {
        const headerResult = await conn.query(
          "SELECT header_id FROM techcoach_lite.techcoach_profile_swot_headers WHERE LOWER(header_name) = LOWER(?)",
          [item.headerName] 
        );

        const headerId = headerResult.length > 0 ? headerResult[0].header_id : null;

        const encryptedValue = encryptText(item.value, userKey);
        itemsToInsert.push({ userId, headerId, value: encryptedValue }); 
      }
    }

    console.log("itemstoupdate", itemsToUpdate);

    if (itemsToUpdate.length > 0) {
      for (const item of itemsToUpdate) {
        await conn.query(
          "UPDATE techcoach_lite.techcoach_profile_swot_values SET header_value = ? WHERE id = ?",
          [item.value, item.id] 
        );
      }
    }

    console.log("itemstoinsert", itemsToInsert);

    if (itemsToInsert.length > 0) {
      for (const item of itemsToInsert) {
        await conn.query(
          "INSERT INTO techcoach_lite.techcoach_profile_swot_values (user_id, header_id, header_value) VALUES (?, ?, ?)",
          [item.userId, item.headerId, item.value]
        );
      }
    }

    console.log("itemstodelete", itemsToDelete);

    if (itemsToDelete.size > 0) {
      await conn.query(
        "DELETE FROM techcoach_lite.techcoach_profile_swot_values WHERE id IN (?)",
        [[...itemsToDelete]] 
      );
    }

    await conn.commit();
    res.status(200).json({ message: 'General profile data updated successfully' });
  } catch (error) {
    console.error('Error updating general profile data:', error);
    if (conn) {
      await conn.rollback();
    }
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (conn) conn.release();
  }
};


const deleteProfile = async (req, res) => {
  const userId = req.user.id;
  let conn;

  try {
    conn = await getConnection();
    await conn.beginTransaction();

    // Delete from dependent tables first
    await conn.query("DELETE FROM techcoach_lite.techcoach_decision_swot_linked_info WHERE decision_id IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_decision_reason WHERE decision_id IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_decision_tag_linked_info WHERE decision_id IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_shared_decisions WHERE decisionId IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_conversations WHERE decisionId IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    // Delete from techcoach_decision_skill_linked_info before techcoach_decision
    await conn.query("DELETE FROM techcoach_lite.techcoach_decision_skill_linked_info WHERE decision_id IN (SELECT decision_id FROM techcoach_lite.techcoach_decision WHERE user_id = ?)", [userId]);

    // Delete from techcoach_decision
    await conn.query("DELETE FROM techcoach_lite.techcoach_decision WHERE user_id = ?", [userId]);

    // Delete from techcoach_soft_skill_value before techcoach_users
    await conn.query("DELETE FROM techcoach_lite.techcoach_soft_skill_value WHERE user_id = ?", [userId]);

    // Delete from other tables
    await conn.query("DELETE FROM techcoach_lite.techcoach_profile_swot_values WHERE user_id = ?", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_personal_info WHERE user_id = ?", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_login_history WHERE user_id = ?", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_group_members WHERE group_id IN (SELECT id FROM techcoach_lite.techcoach_groups WHERE created_by = ?)", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_group_members WHERE member_id = ?", [userId]);

    await conn.query("DELETE FROM techcoach_lite.techcoach_groups WHERE created_by = ?", [userId]);

    // Delete from techcoach_users
    await conn.query("DELETE FROM techcoach_lite.techcoach_users WHERE user_id = ?", [userId]);

    await conn.commit();
    res.status(200).json({ message: 'Profile and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    if (conn) {
      await conn.rollback();
    }
    res.status(500).json({ error: 'An error occurred while deleting the profile' });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


module.exports = { getUserList, postGeneralProfile,getMasterProfiles, getProfile, putProfile,deleteProfile };