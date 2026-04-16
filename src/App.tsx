import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ArticlesListPage = lazy(() => import("./pages/ArticlesListPage"));
const CMSPage = lazy(() => import("./pages/CMSPage"));
const ScientificPage = lazy(() => import("./pages/ScientificPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GeneralInfoPage = lazy(() => import("./pages/GeneralInfoPage"));
const DissertationsPage = lazy(() => import("./pages/DissertationsPage"));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage"));
const ModernDirectionsPage = lazy(() => import("./pages/ModernDirectionsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/article/:slug" element={<ArticlePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:slug" element={<CategoriesPage />} />
                  <Route path="/articles" element={<ArticlesListPage />} />
                  <Route path="/scientific" element={<ScientificPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/general-info" element={<GeneralInfoPage />} />
                  <Route path="/dissertations" element={<DissertationsPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route path="/modern-directions" element={<ModernDirectionsPage />} />
                  <Route path="/cms" element={<CMSPage />} />
                  <Route path="/admin" element={<CMSPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
