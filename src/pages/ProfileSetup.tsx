
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronsRight, Leaf, Loader2, Upload } from 'lucide-react';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || '/placeholder.svg',
    gender: user?.gender || '',
    languages: user?.languages || ['English'],
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
  
  const totalSteps = 4;
  
  // Demo data for dropdowns
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
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Update profile in context
      await updateUser({
        ...formData,
        profileCompleted: true
      });
      
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
                  required
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
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                placeholder="Tell us about yourself and your professional background"
                value={formData.bio}
                onChange={handleTextChange}
                className="input-primary min-h-[150px]"
                required
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
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
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
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
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
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div className="bg-lilac-light p-4 rounded-lg">
                  <p className="font-medium">Name</p>
                  <p>{formData.name || 'Not provided'}</p>
                </div>
                
                <div className="bg-lilac-light p-4 rounded-lg">
                  <p className="font-medium">Experience</p>
                  <p>{formData.experience || 'Not provided'}</p>
                </div>
                
                <div className="bg-lilac-light p-4 rounded-lg">
                  <p className="font-medium">Specializations</p>
                  <p>{formData.specializations.length > 0 
                      ? formData.specializations.join(', ') 
                      : 'None selected'}</p>
                </div>
                
                <div className="bg-lilac-light p-4 rounded-lg">
                  <p className="font-medium">Session Types</p>
                  <div className="flex space-x-2">
                    {formData.sessionPreferences.chat && 
                      <span className="px-2 py-1 bg-green text-xs rounded-full">Chat</span>
                    }
                    {formData.sessionPreferences.audio && 
                      <span className="px-2 py-1 bg-green text-xs rounded-full">Audio</span>
                    }
                    {formData.sessionPreferences.video && 
                      <span className="px-2 py-1 bg-green text-xs rounded-full">Video</span>
                    }
                    {!formData.sessionPreferences.chat && 
                     !formData.sessionPreferences.audio && 
                     !formData.sessionPreferences.video && 
                      <span>None selected</span>
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-light/30 p-4 rounded-lg">
              <p className="text-sm">
                By completing your profile setup, you agree to our Terms of Service and Privacy Policy.
                Your profile information will be visible to clients seeking therapy.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-lilac py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-green rounded-full p-2 mr-2">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold">HealerNest</h1>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-green">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display">Profile Setup</CardTitle>
            <CardDescription>
              Complete your therapist profile to start connecting with clients
            </CardDescription>
            
            <div className="pt-4">
              <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      ${currentStep > index + 1 
                        ? 'bg-green text-white' 
                        : currentStep === index + 1 
                          ? 'bg-green-light border-2 border-green' 
                          : 'bg-lilac-light text-gray-500'}
                    `}>
                      {currentStep > index + 1 ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    
                    {index < totalSteps - 1 && (
                      <div className={`w-full h-1 mx-1 ${currentStep > index + 1 ? 'bg-green' : 'bg-lilac-light'}`} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2 text-xs">
                <span>Basic Info</span>
                <span>Professional</span>
                <span>Expertise</span>
                <span>Preferences</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
                variant="outline"
                className="border-green text-green hover:bg-green-light/20"
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Continue
                  <ChevronsRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
