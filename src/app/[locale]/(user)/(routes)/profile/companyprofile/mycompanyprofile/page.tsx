// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { FileUp, Plus, Pencil, Save, Trash, Menu } from "lucide-react";
// import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';
// import PDFUpload from '@/components/common/pdf-upload';
// import ImageUpload from '@/components/pages/user/profile/forms/components/upload-image';

// const CompanyProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [customFields, setCustomFields] = useState([]);
//   const [isCurrentUser, setIsCurrentUser] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState('info');
//   const [isMobile, setIsMobile] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const data = await getCurrentCompanyProfile();
//       if (data) {
//         setProfile(data);
//         setCustomFields(data.customFields || []);
//         setIsCurrentUser(true);  // For demo purposes. In real app, compare with current user ID
//       }
//     };
//     fetchProfile();

//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCustomFieldChange = (index, field, value) => {
//     const updatedFields = [...customFields];
//     updatedFields[index][field] = value;
//     setCustomFields(updatedFields);
//   };

//   const addCustomField = () => {
//     setCustomFields([...customFields, { title: '', description: '', pdfUrl: '' }]);
//   };

//   const removeCustomField = (index) => {
//     const updatedFields = customFields.filter((_, i) => i !== index);
//     setCustomFields(updatedFields);
//   };

//   const handleSave = async () => {
//     // Implement save logic here
//     // Don't forget to save customFields along with the profile
//     setIsEditing(false);
//   };

//   const handleImageUpload = (url) => {
//     setProfile(prev => ({ ...prev, profile_image: url }));
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'info':
//         return (
//           <div className="space-y-4">
//             {isEditing && (
//               <div>
//                 <Label htmlFor="profile_image">Profile Image</Label>
//                 <ImageUpload
//                   onChange={handleImageUpload}
//                   onRemove={() => setProfile(prev => ({ ...prev, profile_image: '' }))}
//                   value={profile.profile_image ? [profile.profile_image] : []}
//                   bucketName="company-profiles"
//                 />
//               </div>
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="company_title">Company Title</Label>
//                 <Input 
//                   id="company_title"
//                   name="company_title"
//                   value={profile.company_title}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="company_number">Company Number</Label>
//                 <Input 
//                   id="company_number"
//                   name="company_number"
//                   value={profile.company_number}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="company_website">Website</Label>
//                 <Input 
//                   id="company_website"
//                   name="company_website"
//                   value={profile.company_website}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="company_email">Email</Label>
//                 <Input 
//                   id="company_email"
//                   name="company_email"
//                   value={profile.company_email}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone_number">Phone Number</Label>
//                 <Input 
//                   id="phone_number"
//                   name="phone_number"
//                   value={profile.phone_number}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="address">Address</Label>
//                 <Input 
//                   id="address"
//                   name="address"
//                   value={profile.address}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="bio">Bio</Label>
//               <Textarea 
//                 id="bio"
//                 name="bio"
//                 value={profile.bio}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//               />
//             </div>
            
//             {/* Custom Fields */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Custom Fields</h3>
//               {customFields.map((field, index) => (
//                 <div key={index} className="space-y-2 p-4 border rounded">
//                   <Input 
//                     placeholder="Field Title"
//                     value={field.title}
//                     onChange={(e) => handleCustomFieldChange(index, 'title', e.target.value)}
//                     disabled={!isEditing}
//                   />
//                   <Textarea 
//                     placeholder="Field Description"
//                     value={field.description}
//                     onChange={(e) => handleCustomFieldChange(index, 'description', e.target.value)}
//                     disabled={!isEditing}
//                   />
//                   <PDFUpload
//                     onChange={(url) => handleCustomFieldChange(index, 'pdfUrl', url)}
//                     onRemove={() => handleCustomFieldChange(index, 'pdfUrl', '')}
//                     value={field.pdfUrl ? [field.pdfUrl] : []}
//                     bucketName="custom-fields"
//                     disabled={!isEditing}
//                   />
//                   {isEditing && (
//                     <Button variant="destructive" onClick={() => removeCustomField(index)}>
//                       <Trash className="h-4 w-4 mr-2" /> Remove Field
//                     </Button>
//                   )}
//                 </div>
//               ))}
//               {isEditing && (
//                 <Button onClick={addCustomField}>
//                   <Plus className="h-4 w-4 mr-2" /> Add Custom Field
//                 </Button>
//               )}
//             </div>
//           </div>
//         );
//       case 'tenders':
//         return <p>Tenders content goes here</p>;
//       case 'requests':
//         return isCurrentUser ? <p>Requests content goes here</p> : null;
//       default:
//         return null;
//     }
//   };

//   const SidebarContent = () => (
//     <div className="space-y-2 py-4">
//       <Button
//         variant={activeTab === 'info' ? 'default' : 'ghost'}
//         className="w-full justify-start"
//         onClick={() => setActiveTab('info')}
//       >
//         Info
//       </Button>
//       <Button
//         variant={activeTab === 'tenders' ? 'default' : 'ghost'}
//         className="w-full justify-start"
//         onClick={() => setActiveTab('tenders')}
//       >
//         Tenders
//       </Button>
//       {isCurrentUser && (
//         <Button
//           variant={activeTab === 'requests' ? 'default' : 'ghost'}
//           className="w-full justify-start"
//           onClick={() => setActiveTab('requests')}
//         >
//           Requests
//         </Button>
//       )}
//     </div>
//   );

//   if (!profile) {
//     return (
//       <Card className="w-full max-w-4xl mx-auto">
//         <CardContent className="flex items-center justify-center h-64">
//           <p className="text-xl text-gray-500">No profile found</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="flex w-full max-w-6xl mx-auto">
//       {isMobile ? (
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
//               <Menu className="h-4 w-4" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-64">
//             <ScrollArea className="h-full">
//               <SidebarContent />
//             </ScrollArea>
//           </SheetContent>
//         </Sheet>
//       ) : (
//         <Card className="w-64 mr-4 h-fit">
//           <CardContent>
//             <SidebarContent />
//           </CardContent>
//         </Card>
//       )}
//       <Card className="flex-1">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage src={profile.profile_image} />
//                 <AvatarFallback>{profile.company_title?.charAt(0)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <CardTitle>{profile.company_title || 'Company Profile'}</CardTitle>
//                 <CardDescription>{profile.bio}</CardDescription>
//               </div>
//             </div>
//             {isCurrentUser && !isEditing && (
//               <Button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0">
//                 <Pencil className="mr-2 h-4 w-4" /> Edit
//               </Button>
//             )}
//             {isEditing && (
//               <Button onClick={handleSave} className="mt-4 md:mt-0">
//                 <Save className="mr-2 h-4 w-4" /> Save
//               </Button>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-[calc(100vh-200px)]">
//             {renderTabContent()}
//           </ScrollArea>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CompanyProfile;