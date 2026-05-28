"use client";

import { useState, useCallback } from "react";
import type { EvaluationData } from "@/lib/types";

/**
 * Manages all modal visibility and transient form state.
 * Each modal follows a controlled pattern: isOpen + onClose.
 */
export function useModalState() {
  // Modal visibility
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Gallery modal form state
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("all");

  // Evaluation modal state
  const [evaluationResult, setEvaluationResult] = useState<EvaluationData | null>(null);
  const [evaluationError, setEvaluationError] = useState("");

  // Feedback modal form state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const openGallery = useCallback(() => setIsGalleryOpen(true), []);
  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    // Reset search/filter on close
    setGallerySearch("");
    setGalleryCategory("all");
  }, []);

  const openVersions = useCallback(() => setIsVersionsOpen(true), []);
  const closeVersions = useCallback(() => setIsVersionsOpen(false), []);

  const openEvaluation = useCallback(() => setIsEvaluationOpen(true), []);
  const closeEvaluation = useCallback(() => {
    setIsEvaluationOpen(false);
    // Delay result clear so modal exit animation can play
    setTimeout(() => {
      setEvaluationResult(null);
      setEvaluationError("");
    }, 300);
  }, []);

  const openFeedback = useCallback(() => setIsFeedbackOpen(true), []);
  const closeFeedback = useCallback(() => {
    setIsFeedbackOpen(false);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackRating(0);
      setFeedbackComment("");
    }, 300);
  }, []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const resetEvaluation = useCallback(() => {
    setEvaluationResult(null);
    setEvaluationError("");
  }, []);

  return {
    // Gallery
    isGalleryOpen,
    openGallery,
    closeGallery,
    gallerySearch,
    setGallerySearch,
    galleryCategory,
    setGalleryCategory,
    // Versions
    isVersionsOpen,
    openVersions,
    closeVersions,
    // Evaluation
    isEvaluationOpen,
    openEvaluation,
    closeEvaluation,
    evaluationResult,
    setEvaluationResult,
    evaluationError,
    setEvaluationError,
    resetEvaluation,
    // Feedback
    isFeedbackOpen,
    openFeedback,
    closeFeedback,
    feedbackRating,
    setFeedbackRating,
    feedbackComment,
    setFeedbackComment,
    feedbackSubmitted,
    setFeedbackSubmitted,
    // Settings
    isSettingsOpen,
    openSettings,
    closeSettings,
  };
}
