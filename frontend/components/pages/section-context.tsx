"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  type Section,
  type SectionType,
  type SectionContent,
  availablePages as fetchAvailablePages,
  initialSections,
  createDefaultContent,
} from "./section-types"

interface SectionContextType {
  // State
  selectedPageId: string
  sections: Record<string, Section[]>
  selectedSectionId: string | null
  draggedSectionId: string | null
  dragOverSectionId: string | null
  activeCarouselSlide: number
  isMobileView: boolean
  showSectionList: boolean
  carouselDirection: number
  isCarouselAnimating: boolean
  isSwiping: boolean

  // Setters
  setSelectedPageId: (id: string) => void
  setSections: (sections: Record<string, Section[]>) => void
  setSelectedSectionId: (id: string | null) => void
  setDraggedSectionId: (id: string | null) => void
  setDragOverSectionId: (id: string | null) => void
  setActiveCarouselSlide: (index: number) => void
  setShowSectionList: (show: boolean) => void
  setCarouselDirection: (direction: number) => void
  setIsCarouselAnimating: (isAnimating: boolean) => void
  setIsSwiping: (isSwiping: boolean) => void

  // Computed values
  selectedPage: { id: string; title: string } | undefined
  pageSections: Section[]
  selectedSection: Section | undefined

  // Actions
  handleDragStart: (e: React.DragEvent, sectionId: string) => void
  handleDragOver: (e: React.DragEvent, sectionId: string) => void
  handleDrop: (e: React.DragEvent, targetSectionId: string) => void
  handleDragEnd: () => void
  handleSectionTypeChange: (type: SectionType) => void
  updateSectionContent: <T extends keyof SectionContent>(field: T, value: SectionContent[T]) => void
  updateSectionTitle: (title: string) => void
  addNewSection: () => void
  deleteSection: (sectionId: string) => void

  // Touch handlers
  touchStartX: React.MutableRefObject<number>
  touchEndX: React.MutableRefObject<number>
  touchStartY: React.MutableRefObject<number>
  touchEndY: React.MutableRefObject<number>
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedPageId, setSelectedPageId] = useState<string>("1")
  const [sections, setSections] = useState(initialSections)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null)
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null)
  const [activeCarouselSlide, setActiveCarouselSlide] = useState<number>(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showSectionList, setShowSectionList] = useState(true)
  const [carouselDirection, setCarouselDirection] = useState(0)
  const [isCarouselAnimating, setIsCarouselAnimating] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const [pages, setPages] = useState<{ id: string; title: string }[]>([])

  const touchStartX = React.useRef(0)
  const touchEndX = React.useRef(0)
  const touchStartY = React.useRef(0)
  const touchEndY = React.useRef(0)

  // Check if we're in mobile view
  useEffect(() => {
    fetchAvailablePages()
      .then((data) => setPages(data))
      .catch(() => setPages([]))
    
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowSectionList(true)
      }
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  const selectedPage = pages.find((page) => page.id === selectedPageId)
  const pageSections = sections[selectedPageId] || []
  const selectedSection = pageSections.find((section) => section.id === selectedSectionId)

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId)
  }

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    if (draggedSectionId !== sectionId) {
      setDragOverSectionId(sectionId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault()
    if (!draggedSectionId || draggedSectionId === targetSectionId) return

    const updatedSections = { ...sections }
    const pageSpecificSections = [...updatedSections[selectedPageId]]

    const draggedIndex = pageSpecificSections.findIndex((section) => section.id === draggedSectionId)
    const targetIndex = pageSpecificSections.findIndex((section) => section.id === targetSectionId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedSection] = pageSpecificSections.splice(draggedIndex, 1)
      pageSpecificSections.splice(targetIndex, 0, draggedSection)

      updatedSections[selectedPageId] = pageSpecificSections
      setSections(updatedSections)
    }

    setDraggedSectionId(null)
    setDragOverSectionId(null)
  }

  const handleDragEnd = () => {
    setDraggedSectionId(null)
    setDragOverSectionId(null)
  }

  const handleSectionTypeChange = (type: SectionType) => {
    if (!selectedSectionId) return

    const updatedSections = { ...sections }
    const pageSpecificSections = [...updatedSections[selectedPageId]]
    const sectionIndex = pageSpecificSections.findIndex((section) => section.id === selectedSectionId)

    if (sectionIndex !== -1) {
      // Create new content based on the selected type
      const newContent = createDefaultContent(type)

      // Preserve the title if possible
      if (pageSpecificSections[sectionIndex].content.title) {
        newContent.title = pageSpecificSections[sectionIndex].content.title
      }

      pageSpecificSections[sectionIndex] = {
        ...pageSpecificSections[sectionIndex],
        type,
        content: newContent,
      }

      updatedSections[selectedPageId] = pageSpecificSections
      setSections(updatedSections)
      setActiveCarouselSlide(0) // Reset active slide when changing section type
    }
  }

  const updateSectionContent = <T extends keyof SectionContent>(field: T, value: SectionContent[T]) => {
    if (!selectedSectionId) return

    const updatedSections = { ...sections }
    const pageSpecificSections = [...updatedSections[selectedPageId]]
    const sectionIndex = pageSpecificSections.findIndex((section) => section.id === selectedSectionId)

    if (sectionIndex !== -1) {
      pageSpecificSections[sectionIndex] = {
        ...pageSpecificSections[sectionIndex],
        content: {
          ...pageSpecificSections[sectionIndex].content,
          [field]: value,
        },
      }

      updatedSections[selectedPageId] = pageSpecificSections
      setSections(updatedSections)
    }
  }

  const updateSectionTitle = (title: string) => {
    if (!selectedSectionId) return

    const updatedSections = { ...sections }
    const pageSpecificSections = [...updatedSections[selectedPageId]]
    const sectionIndex = pageSpecificSections.findIndex((section) => section.id === selectedSectionId)

    if (sectionIndex !== -1) {
      pageSpecificSections[sectionIndex] = {
        ...pageSpecificSections[sectionIndex],
        title,
      }

      updatedSections[selectedPageId] = pageSpecificSections
      setSections(updatedSections)
    }
  }

  const addNewSection = () => {
    const newSection: Section = {
      id: `s${Date.now()}`,
      title: "New Section",
      type: "TEXT",
      content: createDefaultContent("TEXT"),
    }

    const updatedSections = { ...sections }
    updatedSections[selectedPageId] = [...(updatedSections[selectedPageId] || []), newSection]
    setSections(updatedSections)
    setSelectedSectionId(newSection.id)

    // On mobile, switch to editor view after adding a new section
    if (isMobileView) {
      setShowSectionList(false)
    }
  }

  const deleteSection = (sectionId: string) => {
    const updatedSections = { ...sections }
    updatedSections[selectedPageId] = updatedSections[selectedPageId].filter((section) => section.id !== sectionId)
    setSections(updatedSections)

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null)
    }
  }

  const value = {
    // State
    selectedPageId,
    sections,
    pages,
    selectedSectionId,
    draggedSectionId,
    dragOverSectionId,
    activeCarouselSlide,
    isMobileView,
    showSectionList,
    carouselDirection,
    isCarouselAnimating,
    isSwiping,

    // Setters
    setSelectedPageId,
    setSections,
    setSelectedSectionId,
    setDraggedSectionId,
    setDragOverSectionId,
    setActiveCarouselSlide,
    setShowSectionList,
    setCarouselDirection,
    setIsCarouselAnimating,
    setIsSwiping,

    // Computed values
    selectedPage,
    pageSections,
    selectedSection,

    // Actions
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleSectionTypeChange,
    updateSectionContent,
    updateSectionTitle,
    addNewSection,
    deleteSection,

    // Touch handlers
    touchStartX,
    touchEndX,
    touchStartY,
    touchEndY,
  }

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>
}

export function useSectionContext() {
  const context = useContext(SectionContext)
  if (context === undefined) {
    throw new Error("useSectionContext must be used within a SectionProvider")
  }
  return context
}
