// export const modifyPayload = (values: any) => {
//   const obj = { ...values };
//   const file = obj["file"];
//   delete obj["file"];
//   const data = JSON.stringify(obj);
//   const formData = new FormData();
//   formData.append("data", data);
//   formData.append("file", file as Blob);

//   return formData;
// };


// Expected structure for modifyPayload
// export const modifyPayload = (values: any) => {
//   const obj = { ...values };
//   const file = obj.file;
//   delete obj.file;
  
//   const data = JSON.stringify(obj);
//   const formData = new FormData();
  
//   formData.append('data', data);
//   formData.append('file', file as Blob);
  
//   return formData;
// };

export const modifyPayload = (values: any) => {
  console.log('modifyPayload received:', values);
  
  const obj = { ...values };
  const file = obj.file;
  delete obj.file;
  

  
  const data = JSON.stringify(obj);
  const formData = new FormData();
  
  formData.append('data', data);
  
  // Proper file handling
  if (file instanceof File) {
    formData.append('file', file);
  } 

  
  return formData;
};