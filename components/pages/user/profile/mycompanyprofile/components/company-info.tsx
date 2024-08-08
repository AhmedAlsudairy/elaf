import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../../forms/components/upload-image";

export function ProfileInfo({ profile, setProfile, customSections, setCustomSections, isEditing }: ProfileInfoProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSectionUpdate = (updatedSection: CustomSection) => {
      setCustomSections(prev => prev.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      ));
    };
  
    const handleSectionRemove = (id: string) => {
      setCustomSections(prev => prev.filter(section => section.id !== id));
    };
  
    const addCustomSection = () => {
      const newSection: CustomSection = {
        id: Date.now().toString(),
        title: '',
        description: '',
        pdfUrl: ''
      };
      setCustomSections(prev => [...prev, newSection]);
    };
  
    const handleImageUpload = (url: string) => {
      setProfile(prev => ({ ...prev, profile_image: url }));
    };
  
    return (
      <div className="space-y-6">
        {isEditing && (
          <div>
            <Label htmlFor="profile_image">Profile Image</Label>
            <ImageUpload
              onChange={handleImageUpload}
              onRemove={() => setProfile(prev => ({ ...prev, profile_image: '' }))}
              value={profile.profile_image ? [profile.profile_image] : []}
              bucketName="company-profiles"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_title">Company Title</Label>
            <Input 
              id="company_title"
              name="company_title"
              value={profile.company_title}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div>
            <Label htmlFor="company_number">Company Number</Label>
            <Input 
              id="company_number"
              name="company_number"
              value={profile.company_number}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="company_website">Website</Label>
            <Input 
              id="company_website"
              name="company_website"
              value={profile.company_website}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="company_email">Email</Label>
            <Input 
              id="company_email"
              name="company_email"
              value={profile.company_email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input 
              id="phone_number"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        
       
      </div>
    );
  }