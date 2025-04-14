import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Loader2, Upload, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || '/placeholder.svg',
    gender: user?.gender || '',
    languages: user?.languages || [],
    bio: user?.bio || '',
    experience: user?.experience || '',
    therapyStyles: user?.therapyStyles || [],
    specializations: user?.specializations || [],
    availability: user?.availability || {
      days: [],
      times: []
    },
    sessionPreferences: user?.sessionPreferences || {
      chat: true,
      audio: false,
      video: false
    }
  });
  
  const therapyStyleOptions = [
    'Cognitive Behavioral Therapy (CBT)', 
    'Mindfulness-Based Therapy',
    'Psychodynamic Therapy', 
    'Humanistic Therapy',
    'Dialectical Behavior Therapy (DBT)',
    'Solution-Focused Brief Therapy',
    'Narrative Therapy',
    'Family Systems Therapy'
  ];
  
  const specializationOptions = [
    'Anxiety',
    'Depression',
    'Trauma',
    'Relationship Issues',
    'Grief & Loss',
    'Self-Esteem',
    'Stress Management',
    'Career Counseling',
    'Addiction',
    'LGBTQ+ Issues',
    'Eating Disorders',
    'Life Transitions'
  ];
  
  const dayOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  
  const timeOptions = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM'
  ];
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxToggle = (name: string, value: string, checked: boolean) => {
    const currentValues = formData[name as keyof typeof formData] as string[];
    let updatedValues;
    
    if (checked) {
      updatedValues = [...currentValues, value];
    } else {
      updatedValues = currentValues.filter(item => item !== value);
    }
    
    setFormData({
      ...formData,
      [name]: updatedValues
    });
  };
  
  const handleAvailabilityChange = (type: 'days' | 'times', value: string, checked: boolean) => {
    const currentValues = formData.availability[type];
    let updatedValues;
    
    if (checked) {
      updatedValues = [...currentValues, value];
    } else {
      updatedValues = currentValues.filter(item => item !== value);
    }
    
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [type]: updatedValues
      }
    });
  };
  
  const handleSessionPreferenceChange = (type: 'chat' | 'audio' | 'video', checked: boolean) => {
    setFormData({
      ...formData,
      sessionPreferences: {
        ...formData.sessionPreferences,
        [type]: checked
      }
    });
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await updateUser({
        ...formData,
        profileCompleted: true
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Button 
          onClick={handleChangePassword}
          className="bg-green hover:bg-green/90 flex items-center"
        >
          <Lock className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="text-center mb-6">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24 border-4 border-green-light">
                    <AvatarImage src={formData.profilePicture} />
                    <AvatarFallback className="text-2xl bg-green-light">
                      {formData.name ? formData.name[0] : 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    type="button" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full bg-green h-8 w-8"
                    variant="default"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleTextChange}
                    className="input-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className="input-primary">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi'].map(language => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`language-${language}`}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => 
                            handleCheckboxToggle('languages', language, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`language-${language}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="professional" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  placeholder="Tell us about yourself and your professional background"
                  value={formData.bio}
                  onChange={handleTextChange}
                  className="input-primary min-h-[150px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select 
                  value={formData.experience} 
                  onValueChange={(value) => handleSelectChange('experience', value)}
                >
                  <SelectTrigger className="input-primary">
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< 1 year">Less than 1 year</SelectItem>
                    <SelectItem value="1-3 years">1-3 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5-10 years">5-10 years</SelectItem>
                    <SelectItem value="> 10 years">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Therapy Styles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {therapyStyleOptions.map(style => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`style-${style}`}
                        checked={formData.therapyStyles.includes(style)}
                        onCheckedChange={(checked) => 
                          handleCheckboxToggle('therapyStyles', style, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`style-${style}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="expertise" className="space-y-6">
              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specializationOptions.map(specialization => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`specialization-${specialization}`}
                        checked={formData.specializations.includes(specialization)}
                        onCheckedChange={(checked) => 
                          handleCheckboxToggle('specializations', specialization, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`specialization-${specialization}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {specialization}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Available Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {dayOptions.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${day}`}
                        checked={formData.availability.days.includes(day)}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange('days', day, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`day-${day}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {timeOptions.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`time-${time}`}
                        checked={formData.availability.times.includes(time)}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange('times', time, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`time-${time}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-2">
                <Label>Session Preferences</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg border-lilac-light">
                    <Checkbox 
                      id="preference-chat"
                      checked={formData.sessionPreferences.chat}
                      onCheckedChange={(checked) => 
                        handleSessionPreferenceChange('chat', checked as boolean)
                      }
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="preference-chat"
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Text Chat Sessions
                      </label>
                      <p className="text-sm text-gray-500">Conduct therapy sessions via text chat</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg border-lilac-light">
                    <Checkbox 
                      id="preference-audio"
                      checked={formData.sessionPreferences.audio}
                      onCheckedChange={(checked) => 
                        handleSessionPreferenceChange('audio', checked as boolean)
                      }
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="preference-audio"
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Audio Sessions
                      </label>
                      <p className="text-sm text-gray-500">Conduct voice-only therapy sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg border-lilac-light">
                    <Checkbox 
                      id="preference-video"
                      checked={formData.sessionPreferences.video}
                      onCheckedChange={(checked) => 
                        handleSessionPreferenceChange('video', checked as boolean)
                      }
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="preference-video"
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Video Sessions
                      </label>
                      <p className="text-sm text-gray-500">Conduct therapy sessions with video</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <Button 
              onClick={handleSubmit}
              className="w-full mt-6 bg-green hover:bg-green/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
