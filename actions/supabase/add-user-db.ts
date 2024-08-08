// import { getUserDetails } from "./get-user-details";
// import { createClient } from "@/lib/utils/supabase/server";

// export async function upsertUserDetails() {
//     try {
//       // Assuming getUserDetails() is a function that fetches user details
//       const userDetails = await getUserDetails();
  
//       const { id, name, email, avatarUrl } = userDetails;
//   const supabase = createClient()
      
//       const { data, error } = await supabase
//         .from('users')
//         .upsert({
//           email: email,
//           name: name,
//           imageurl: avatarUrl
//         });
  
//       if (error) {
//         console.error('Error upserting user details:', error);
//         return null;
//       }
  
//       console.log('User details upserted successfully:', data);
//       return data;
//     } catch (err) {
//       console.error('An error occurred:', err);
//       return null;
//     }
//   }
  
//   // Example usage
//   // upsertUserDetails(supabase);
  