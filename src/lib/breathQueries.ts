
import { supabase } from "@/integrations/supabase/client";
import { BreathingPattern, ExpandedPattern } from "./dbTypes";

/**
 * Fetches all breathing patterns from the database
 * @returns Promise with all breathing patterns
 */
export async function getAllBreathingPatterns(): Promise<BreathingPattern[]> {
  const { data, error } = await supabase
    .from("breathing_patterns")
    .select("*")
    .order("name");
    
  if (error) {
    console.error("Error fetching breathing patterns:", error);
    throw error;
  }
  
  return data.map(pattern => ({
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    goalId: pattern.goal_id,
    recommendedMinutes: pattern.recommended_minutes,
    cycleSeconds: pattern.cycle_secs,
    createdAt: pattern.created_at,
  }));
}

/**
 * Fetches breathing patterns by goal slug
 * @param slug The goal slug to filter patterns
 * @returns Promise with patterns matching the goal
 */
export async function getPatternsByGoalSlug(slug: string): Promise<ExpandedPattern[]> {
  // First get the goal ID from the slug
  const { data: goalData, error: goalError } = await supabase
    .from("breathing_goals")
    .select("id")
    .eq("slug", slug)
    .single();
    
  if (goalError) {
    console.error(`Error fetching goal with slug ${slug}:`, goalError);
    throw goalError;
  }
  
  // Then get patterns for that goal
  const { data: patterns, error: patternsError } = await supabase
    .from("breathing_patterns")
    .select("*")
    .eq("goal_id", goalData.id);
    
  if (patternsError) {
    console.error(`Error fetching patterns for goal ${goalData.id}:`, patternsError);
    throw patternsError;
  }
  
  // For each pattern, get its steps with the breathing step details
  const expandedPatterns = await Promise.all(
    patterns.map(async (pattern) => {
      const { data: patternSteps, error: stepsError } = await supabase
        .from("breathing_pattern_steps")
        .select(`
          *,
          step:breathing_steps(*)
        `)
        .eq("pattern_id", pattern.id)
        .order("position");
        
      if (stepsError) {
        console.error(`Error fetching steps for pattern ${pattern.id}:`, stepsError);
        throw stepsError;
      }
      
      // Transform to camelCase
      const formattedSteps = patternSteps.map(ps => ({
        patternId: ps.pattern_id,
        stepId: ps.step_id,
        position: ps.position,
        repetitions: ps.repetitions || 1,
        step: ps.step ? {
          id: ps.step.id,
          inhaleMethod: ps.step.inhale_method,
          inhaleSeconds: ps.step.inhale_secs,
          holdInSeconds: ps.step.hold_in_secs, 
          exhaleMethod: ps.step.exhale_method,
          exhaleSeconds: ps.step.exhale_secs,
          holdOutSeconds: ps.step.hold_out_secs,
          cueText: ps.step.cue_text
        } : undefined
      }));
      
      return {
        id: pattern.id,
        name: pattern.name,
        description: pattern.description,
        goalId: pattern.goal_id,
        recommendedMinutes: pattern.recommended_minutes,
        cycleSeconds: pattern.cycle_secs,
        createdAt: pattern.created_at,
        steps: formattedSteps
      };
    })
  );
  
  return expandedPatterns;
}

/**
 * Logs when a user runs a breathing pattern
 * @param userId The user ID
 * @param patternId The pattern ID
 * @returns Promise with the updated record
 */
export async function logPatternRun(userId: string, patternId: string): Promise<void> {
  const { error } = await supabase
    .from("breathing_pattern_status")
    .upsert({
      user_id: userId,
      pattern_id: patternId,
      last_run: new Date().toISOString(),
      total_runs: 1
    }, {
      onConflict: 'user_id,pattern_id',
      ignoreDuplicates: false
    })
    .select();
    
  if (error) {
    console.error("Error logging pattern run:", error);
    throw error;
  }
}
