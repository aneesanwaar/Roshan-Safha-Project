import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";

import { getPublicGalleryPhotos } from "../services/api";

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePhotoId, setActivePhotoId] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicGalleryPhotos();

      const data =
        response.data?.data ||
        response.data ||
        [];

      if (!Array.isArray(data)) {
        throw new Error("Invalid gallery response.");
      }

      setPhotos(data);
    } catch (err) {
      console.error("Failed to load gallery:", err);

      setError(
        "We couldn't load the gallery right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Build album filters from real gallery data.
  const albums = useMemo(() => {
    const albumNames = [
      ...new Set(
        photos
          .map((photo) => photo.album)
          .filter(Boolean)
      ),
    ];

    return ["All", ...albumNames];
  }, [photos]);

  // Filter images by the selected album.
  const filteredPhotos = useMemo(() => {
    if (selectedAlbum === "All") {
      return photos;
    }

    return photos.filter(
      (photo) => photo.album === selectedAlbum
    );
  }, [photos, selectedAlbum]);

  // The lightbox always follows the current filtered collection.
  const activeIndex = filteredPhotos.findIndex(
    (photo) => photo._id === activePhotoId
  );

  const activePhoto =
    activeIndex >= 0
      ? filteredPhotos[activeIndex]
      : null;

  const openLightbox = (photo) => {
    setActivePhotoId(photo._id);
  };

  const closeLightbox = () => {
    setActivePhotoId(null);
  };

  const showPrevious = () => {
    if (!filteredPhotos.length) return;

    const previousIndex =
      (activeIndex - 1 + filteredPhotos.length) %
      filteredPhotos.length;

    setActivePhotoId(filteredPhotos[previousIndex]._id);
  };

  const showNext = () => {
    if (!filteredPhotos.length) return;

    const nextIndex =
      (activeIndex + 1) % filteredPhotos.length;

    setActivePhotoId(filteredPhotos[nextIndex]._id);
  };

  // Keyboard navigation and background scroll lock.
  useEffect(() => {
    if (!activePhoto) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [activePhotoId, activeIndex, filteredPhotos]);

  const getAlbumCount = (album) => {
    if (album === "All") {
      return photos.length;
    }

    return photos.filter(
      (photo) => photo.album === album
    ).length;
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] font-sans">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#193E32] px-5 py-16 text-white sm:px-8 sm:py-20">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#E8A94A]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="max-w-3xl">

            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A94A]/35 bg-[#E8A94A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F4C477]">

              

              Moments That Matter

            </div> */}

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">

              Stories Through

              <span className="block text-[#E8A94A]">
                Our Lens.
              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">

              Every book shared, every student inspired, and every
              community brought together has a story. Explore the
              moments shaping Roshan Safha's literacy journey
              across Azad Jammu and Kashmir.

            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3">

                <Camera className="h-5 w-5 text-[#E8A94A]" />

                <div>

                  <p className="text-xl font-black">
                    {photos.length}
                  </p>

                  <p className="text-[11px] text-white/65">
                    Captured Moments
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3">

                <ImageIcon className="h-5 w-5 text-[#E8A94A]" />

                <div>

                  <p className="text-xl font-black">
                    {Math.max(albums.length - 1, 0)}
                  </p>

                  <p className="text-[11px] text-white/65">
                    Photo Collections
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* GALLERY CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#B47C25]">
              The Visual Archive
            </p>

            <h2 className="text-2xl font-black tracking-tight text-[#193E32] sm:text-3xl">
              Explore Our Gallery
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Browse the people, places, and moments behind our mission.
            </p>

          </div>

          {!loading && !error && (
            <div className="inline-flex self-start items-center gap-2 rounded-full border border-[#DCE6DB] bg-white px-4 py-2 text-xs font-bold text-[#276B56]">

              <Camera className="h-4 w-4" />

              {filteredPhotos.length}{" "}
              {filteredPhotos.length === 1 ? "Photo" : "Photos"}

            </div>
          )}

        </div>

        {/* ALBUM FILTERS */}
        {!loading && !error && photos.length > 0 && (
          <div className="mb-9 flex flex-wrap gap-2">

            {albums.map((album) => {
              const isActive = selectedAlbum === album;

              return (
                <button
                  key={album}
                  type="button"
                  onClick={() => {
                    setSelectedAlbum(album);
                    closeLightbox();
                  }}
                  aria-pressed={isActive}
                  className={`
                    inline-flex items-center gap-2 rounded-full
                    border px-4 py-2.5 text-xs font-bold
                    transition-all duration-200
                    ${
                      isActive
                        ? "border-[#193E32] bg-[#193E32] text-white shadow-md"
                        : "border-[#DFE7DC] bg-white text-[#426257] hover:border-[#276B56] hover:text-[#193E32]"
                    }
                  `}
                >

                  <span>{album === "All" ? "All Photos" : album}</span>

                  <span
                    className={`
                      rounded-full px-2 py-0.5 text-[10px]
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#E7EEE5] text-[#276B56]"
                      }
                    `}
                  >
                    {getAlbumCount(album)}
                  </span>

                </button>
              );
            })}

          </div>
        )}

        {/* LOADING SKELETONS */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[22px] border border-[#E5EAE3] bg-white"
              >

                <div className="h-56 animate-pulse bg-[#E7EEE5]" />

                <div className="space-y-3 p-4">

                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E7EEE5]" />

                  <div className="h-3 w-full animate-pulse rounded bg-[#F0F3ED]" />

                </div>

              </div>
            ))}

          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-[26px] border border-rose-100 bg-white px-6 py-14 text-center shadow-sm">

            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-rose-300" />

            <h3 className="text-lg font-black text-[#193E32]">
              Gallery Unavailable
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchGallery}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#276B56]"
            >

              <RefreshCw className="h-4 w-4" />

              Try Again

            </button>

          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="mx-auto max-w-lg rounded-[26px] border border-[#E5EAE3] bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7EEE5]">

              <ImageIcon className="h-8 w-8 text-[#276B56]" />

            </div>

            <h3 className="text-lg font-black text-[#193E32]">
              No Photos Yet
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              There are no photos in this collection yet.
              More moments will be added soon.
            </p>

            {selectedAlbum !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedAlbum("All")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-5 py-3 text-xs font-bold text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                View All Photos
              </button>
            )}

          </div>
        )}

        {/* PHOTO GRID */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredPhotos.map((photo) => (
              <button
                key={photo._id}
                type="button"
                onClick={() => openLightbox(photo)}
                className="
                  group overflow-hidden rounded-[22px]
                  border border-[#E5EAE3] bg-white
                  text-left shadow-[0_6px_24px_rgba(25,62,50,0.04)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#CBDCCF]
                  hover:shadow-[0_18px_40px_rgba(25,62,50,0.12)]
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#276B56]
                "
                aria-label={`View ${photo.title || "gallery photo"}`}
              >

                {/* Photo */}
                <div className="relative h-56 overflow-hidden bg-[#E7EEE5]">

                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || photo.title || "Roshan Safha gallery"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#102A22]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm">

                      <ZoomIn className="h-6 w-6" />

                    </div>

                  </div>

                  {/* Album label */}
                  {photo.album && (
                    <span className="absolute left-3 top-3 max-w-[85%] truncate rounded-full border border-white/25 bg-[#193E32]/90 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">

                      {photo.album}

                    </span>
                  )}

                </div>

                {/* Card content */}
                <div className="p-4">

                  <h3 className="line-clamp-1 text-sm font-extrabold text-[#193E32]">
                    {photo.title || "Roshan Safha Moment"}
                  </h3>

                  {photo.caption && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {photo.caption}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-[#EDF1EB] pt-3">

                    <span className="text-[11px] font-bold text-[#276B56]">
                      View Photo
                    </span>

                    <ArrowRight className="h-4 w-4 text-[#276B56] transition-transform group-hover:translate-x-1" />

                  </div>

                </div>

              </button>
            ))}

          </div>
        )}

        {/* FOOTER NOTE */}
        {!loading && !error && photos.length > 0 && (
          <div className="mt-14 border-t border-[#DFE7DC] pt-7 text-center">

            <p className="text-xs leading-6 text-[#789083]">
              A growing collection of meaningful moments from
              the Roshan Safha community.
            </p>

          </div>
        )}

      </section>

      {/* LIGHTBOX */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07140F]/95 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={closeLightbox}
        >

          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-7 sm:top-6"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Photo counter */}
          <div className="absolute left-4 top-5 z-20 text-xs font-bold tracking-wider text-white/70 sm:left-7 sm:top-8">
            {activeIndex + 1} / {filteredPhotos.length}
          </div>

          {/* Viewer */}
          <div
            className="flex w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="relative flex w-full items-center justify-center">

              {/* Previous */}
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-black/70 sm:-left-3 sm:h-12 sm:w-12"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                key={activePhoto._id}
                src={activePhoto.imageUrl}
                alt={
                  activePhoto.caption ||
                  activePhoto.title ||
                  "Roshan Safha gallery photo"
                }
                className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[72vh]"
              />

              {/* Next */}
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-black/70 sm:-right-3 sm:h-12 sm:w-12"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

            </div>

            {/* Caption */}
            <div className="mt-5 w-full max-w-3xl text-center">

              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E8A94A]">
                {activePhoto.album || "Roshan Safha"}
              </p>

              <h3 className="text-lg font-black text-white sm:text-xl">
                {activePhoto.title || "Roshan Safha Moment"}
              </h3>

              {activePhoto.caption && (
                <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-white/65 sm:text-sm">
                  {activePhoto.caption}
                </p>
              )}

              {filteredPhotos.length > 1 && (
                <p className="mt-4 text-[11px] text-white/40">
                  Use the arrow keys to browse photos
                </p>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default GalleryPage;