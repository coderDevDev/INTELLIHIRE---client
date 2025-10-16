'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Info, RotateCcw, HelpCircle, Save, X } from 'lucide-react';
import { ScoringCriteria, DEFAULT_SCORING_CONFIG, validateScoringWeights, calculateMaxScore } from '@/types/scoring.types';
import { toast } from 'sonner';

interface ScoringConfigFormProps {
  initialConfig?: ScoringCriteria;
  onSave: (config: ScoringCriteria) => void;
  onCancel: () => void;
  companyName?: string;
  isJobLevel?: boolean;
  hasCustomConfig?: boolean; // Indicates if this is a custom config or using defaults
}

export function ScoringConfigForm({
  initialConfig,
  onSave,
  onCancel,
  companyName,
  isJobLevel = false,
  hasCustomConfig = false
}: ScoringConfigFormProps) {
  const [config, setConfig] = useState<ScoringCriteria>(
    initialConfig || DEFAULT_SCORING_CONFIG
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track changes
  useEffect(() => {
    if (initialConfig) {
      setHasChanges(JSON.stringify(config) !== JSON.stringify(initialConfig));
    } else {
      setHasChanges(JSON.stringify(config) !== JSON.stringify(DEFAULT_SCORING_CONFIG));
    }
  }, [config, initialConfig]);

  const totalWeight = Object.values(config).reduce((sum, field) => {
    return field.enabled ? sum + field.weight : sum;
  }, 0);

  const remainingWeight = 100 - totalWeight;
  const maxScore = calculateMaxScore(config);
  const isValid = validateScoringWeights(config);
  
  // Weight status for color coding
  const getWeightStatus = () => {
    if (Math.abs(totalWeight - 100) < 0.01) return 'perfect'; // Green
    if (totalWeight > 100) return 'over'; // Red
    if (totalWeight < 100 && totalWeight > 90) return 'close'; // Amber
    return 'under'; // Red
  };
  
  const weightStatus = getWeightStatus();

  // Additional validation
  const enabledCount = Object.values(config).filter(f => f.enabled).length;
  const hasAtLeastOneEnabled = enabledCount > 0;
  
  // Validate max points range
  const invalidPoints = Object.entries(config).filter(([key, field]) => 
    field.enabled && (field.maxPoints < 1 || field.maxPoints > 100)
  );
  const hasValidPoints = invalidPoints.length === 0;
  
  // Validate weights are positive for enabled criteria
  const invalidWeights = Object.entries(config).filter(([key, field]) => 
    field.enabled && field.weight <= 0
  );
  const hasValidWeights = invalidWeights.length === 0;
  
  // Overall validation
  const isFormValid = isValid && hasAtLeastOneEnabled && hasValidPoints && hasValidWeights;
  
  // Validation messages
  const getValidationErrors = (): string[] => {
    const errors: string[] = [];
    if (!hasAtLeastOneEnabled) errors.push('At least one criterion must be enabled');
    if (!isValid) errors.push('Total weight must equal 100%');
    if (!hasValidPoints) errors.push('Max points must be between 1 and 100');
    if (!hasValidWeights) errors.push('Weight must be greater than 0 for enabled criteria');
    return errors;
  };

  const handleFieldToggle = (fieldKey: keyof ScoringCriteria) => {
    setConfig(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        enabled: !prev[fieldKey].enabled
      }
    }));
  };

  const handleWeightChange = (fieldKey: keyof ScoringCriteria, weight: number) => {
    // Clamp weight between 0 and 100
    const clampedWeight = Math.max(0, Math.min(100, weight));
    
    setConfig(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        weight: clampedWeight
      }
    }));
  };
  
  // Auto-distribute weights evenly among enabled criteria
  const autoDistributeWeights = () => {
    const enabledFields = Object.entries(config).filter(([_, field]) => field.enabled);
    if (enabledFields.length === 0) return;
    
    const equalWeight = Math.floor(100 / enabledFields.length);
    const remainder = 100 - (equalWeight * enabledFields.length);
    
    setConfig(prev => {
      const updated = { ...prev };
      enabledFields.forEach(([key], index) => {
        updated[key as keyof ScoringCriteria] = {
          ...updated[key as keyof ScoringCriteria],
          weight: equalWeight + (index === 0 ? remainder : 0)
        };
      });
      return updated;
    });
    
    toast.success(`Weights distributed evenly: ${equalWeight}% each`);
  };

  const handleMaxPointsChange = (fieldKey: keyof ScoringCriteria, maxPoints: number) => {
    // Clamp max points between 1 and 100
    const clampedPoints = Math.max(1, Math.min(100, maxPoints || 1));
    
    setConfig(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        maxPoints: clampedPoints
      }
    }));
  };

  const handleSubCriteriaPointsChange = (
    fieldKey: keyof ScoringCriteria,
    subIndex: number,
    points: number
  ) => {
    const field = config[fieldKey];
    // Clamp points between 0 and maxPoints
    const clampedPoints = Math.max(0, Math.min(field.maxPoints, points || 0));
    
    setConfig(prev => {
      const updatedSubCriteria = [...(prev[fieldKey].subCriteria || [])];
      if (updatedSubCriteria[subIndex]) {
        updatedSubCriteria[subIndex] = {
          ...updatedSubCriteria[subIndex],
          points: clampedPoints
        };
      }
      
      return {
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey],
          subCriteria: updatedSubCriteria
        }
      };
    });
  };

  // Check if subCriteria points are in descending order
  const isSubCriteriaOrdered = (fieldKey: keyof ScoringCriteria): boolean => {
    const subCriteria = config[fieldKey].subCriteria;
    if (!subCriteria || subCriteria.length <= 1) return true;
    
    for (let i = 0; i < subCriteria.length - 1; i++) {
      if (subCriteria[i].points < subCriteria[i + 1].points) {
        return false;
      }
    }
    return true;
  };

  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all scoring criteria to default values? This will discard any custom changes.')) {
      setConfig(DEFAULT_SCORING_CONFIG);
      toast.success('Configuration reset to default values');
    }
  };

  const handleSave = async () => {
    // Comprehensive validation
    const errors = getValidationErrors();
    if (errors.length > 0) {
      toast.error(
        `Cannot save configuration:\n${errors.map(e => '• ' + e).join('\n')}`
      );
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(config);
      setHasChanges(false);
      toast.success('Scoring configuration saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">
              📊 PDS Scoring Configuration
              {companyName && <span className="text-blue-600"> - {companyName}</span>}
            </h3>
            <p className="text-sm text-gray-600">
              {isJobLevel
                ? 'Configure scoring specifically for this job post'
                : 'Set default scoring criteria for all jobs under this company'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={hasChanges ? 'default' : 'secondary'} className="text-xs">
                {hasChanges ? '● Unsaved Changes' : '✓ Up to date'}
              </Badge>
              {!hasCustomConfig && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                  📋 Using Default Template
                </Badge>
              )}
              {hasCustomConfig && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                  ⚙️ Custom Configuration
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>

        {/* Weight Status Bar - Sticky */}
        <div className={`sticky top-0 z-10 p-4 rounded-lg border-2 shadow-lg ${
          weightStatus === 'perfect' ? 'bg-green-50 border-green-500' :
          weightStatus === 'over' ? 'bg-red-50 border-red-500' :
          weightStatus === 'close' ? 'bg-amber-50 border-amber-500' :
          'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {weightStatus === 'perfect' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <div className="font-bold text-lg">
                    Total Weight: 
                    <span className={`ml-2 ${
                      weightStatus === 'perfect' ? 'text-green-600' :
                      weightStatus === 'over' ? 'text-red-600' :
                      weightStatus === 'close' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {totalWeight.toFixed(1)}%
                    </span>
                    {weightStatus === 'perfect' && <span className="text-green-600 ml-2">✓ Perfect!</span>}
                  </div>
                  <div className="text-sm mt-1">
                    {weightStatus === 'over' && (
                      <span className="text-red-700 font-medium">Over by {(totalWeight - 100).toFixed(1)}% - reduce weights</span>
                    )}
                    {weightStatus === 'under' && (
                      <span className="text-red-700 font-medium">Remaining: {remainingWeight.toFixed(1)}% - add more weight</span>
                    )}
                    {weightStatus === 'close' && (
                      <span className="text-amber-700 font-medium">Almost there! {remainingWeight.toFixed(1)}% remaining</span>
                    )}
                    {weightStatus === 'perfect' && (
                      <span className="text-green-700">All weights properly distributed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={autoDistributeWeights}
              className="ml-4 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              ⚡ Auto-Distribute
            </Button>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                weightStatus === 'perfect' ? 'bg-green-500' :
                weightStatus === 'over' ? 'bg-red-500' :
                weightStatus === 'close' ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(totalWeight, 100)}%` }}
            />
          </div>
        </div>

        {/* New Configuration Alert */}
        {!hasCustomConfig && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              <strong>✨ Starting with Default Template!</strong> This company has no custom scoring configuration yet. We've loaded a complete template with all 8 criteria, labels, descriptions, and recommended values. You can now adjust weights, points, and enable/disable criteria as needed, then save your customized configuration.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions Card */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>How to configure:</strong> Enable/disable criteria using checkboxes, adjust percentage weights with sliders (must total 100%), and set maximum points for each criterion. The scoring breakdown shows point values for different qualification levels.
          </AlertDescription>
        </Alert>

        {/* Validation Alerts */}
        <div className="grid grid-cols-2 gap-3">
          <Alert variant={isValid ? 'default' : 'destructive'} className="col-span-2 md:col-span-1">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Total Weight:</span>
                <strong className={totalWeight === 100 ? 'text-green-600' : 'text-red-600'}>
                  {totalWeight.toFixed(1)}%
                </strong>
              </div>
              {!isValid && <div className="text-xs mt-1 text-red-600">Must equal 100%</div>}
            </AlertDescription>
          </Alert>

          <Alert className="col-span-2 md:col-span-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Max Possible Score:</span>
                <strong className="text-blue-600">{maxScore} points</strong>
              </div>
              <div className="text-xs mt-1 text-blue-700">
                {enabledCount} of 8 criteria enabled
              </div>
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Additional Validation Errors */}
        {!hasAtLeastOneEnabled && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              At least one criterion must be enabled
            </AlertDescription>
          </Alert>
        )}
        
        {invalidPoints.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid max points in: {invalidPoints.map(([key]) => config[key as keyof ScoringCriteria].label).join(', ')}
              <div className="text-xs mt-1">Max points must be between 1 and 100</div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Research Objectives Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
            📋 Research-Aligned PDS Criteria
          </CardTitle>
          <CardDescription className="text-xs text-blue-700">
            Based on civil service and government hiring standards
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-white text-blue-900">1.4.1</Badge>
            <div>
              <strong>Education:</strong> Educational attainment and academic qualifications
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-white text-blue-900">1.4.2</Badge>
            <div>
              <strong>Experience:</strong> Total years of professional work experience
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-white text-blue-900">1.4.3</Badge>
            <div>
              <strong>Eligibility:</strong> Civil service eligibility and professional licenses
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-white text-blue-900">Other</Badge>
            <div>
              <strong>Additional Criteria:</strong> Training, Skills, Awards, Relevant Experience, Certifications
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Criteria Configuration */}
      <div className="space-y-4">
        {(Object.keys(config) as Array<keyof ScoringCriteria>).map((fieldKey) => {
          const field = config[fieldKey];
          return (
            <Card 
              key={fieldKey} 
              className={`transition-all duration-200 ${!field.enabled ? 'opacity-50 bg-gray-50' : 'bg-white hover:shadow-md'}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={() => handleFieldToggle(fieldKey)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title={field.enabled ? 'Disable this criterion' : 'Enable this criterion'}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">{field.label}</CardTitle>
                        <HelpCircle 
                          className="h-4 w-4 text-gray-400 cursor-help" 
                          title={field.description}
                        />
                      </div>
                      <CardDescription className="text-xs mt-1">
                        {field.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={field.enabled ? 'default' : 'secondary'} className="text-xs">
                      {field.enabled ? '✓ Active' : '○ Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weight Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      Weight (Importance)
                      <HelpCircle className="h-3 w-3 text-gray-400" title="Percentage importance in overall score" />
                    </Label>
                    {field.enabled && field.weight > remainingWeight + field.weight && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        High ({remainingWeight.toFixed(0)}% left for others)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[field.weight]}
                      onValueChange={([value]) => handleWeightChange(fieldKey, value)}
                      min={0}
                      max={100}
                      step={1}
                      disabled={!field.enabled}
                      className="flex-1"
                    />
                    <div className="min-w-[60px] text-right">
                      <span className={`text-lg font-bold ${
                        field.enabled && field.weight > 0 ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {field.weight}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Max Points */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    Maximum Points
                    <HelpCircle className="h-3 w-3 text-gray-400" title="Highest score achievable in this criterion" />
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={field.maxPoints}
                      onChange={(e) =>
                        handleMaxPointsChange(fieldKey, parseInt(e.target.value) || 1)
                      }
                      min={1}
                      max={100}
                      disabled={!field.enabled}
                      className={`w-32 ${
                        field.enabled && (field.maxPoints < 1 || field.maxPoints > 100)
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    <span className="text-sm text-gray-600">points</span>
                    {field.enabled && (field.maxPoints < 1 || field.maxPoints > 100) && (
                      <span className="text-xs text-red-600 font-medium">Must be 1-100</span>
                    )}
                  </div>
                </div>

                {/* Sub-criteria Display - Editable */}
                {field.subCriteria && field.subCriteria.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        📊 Scoring Breakdown
                        <HelpCircle className="h-3 w-3 text-gray-400" title="Edit point values for each qualification level" />
                      </Label>
                      {!isSubCriteriaOrdered(fieldKey) && (
                        <span className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Points should be in descending order
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {field.subCriteria.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{sub.name}</div>
                            <div className="text-xs text-gray-600 mt-0.5">{sub.description}</div>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <Input
                              type="number"
                              value={sub.points}
                              onChange={(e) =>
                                handleSubCriteriaPointsChange(
                                  fieldKey,
                                  idx,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              min={0}
                              max={field.maxPoints}
                              disabled={!field.enabled}
                              className={`w-20 text-center font-bold ${
                                field.enabled && (sub.points > field.maxPoints || sub.points < 0)
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            <span className="text-xs text-gray-500 w-8">pts</span>
                          </div>
                        </div>
                      ))}
                      {field.enabled && (
                        <div className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>
                            Points must be 0-{field.maxPoints}. Recommend descending order (highest qualification = highest points).
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
        <div className="text-sm">
          {isFormValid ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="h-5 w-5" />
              ✓ Configuration is valid and ready to save
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <AlertCircle className="h-5 w-5" />
                ⚠ Configuration has validation errors:
              </div>
              <ul className="list-disc pl-9 text-xs text-red-600 space-y-0.5">
                {getValidationErrors().map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid || isSaving}
            className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
