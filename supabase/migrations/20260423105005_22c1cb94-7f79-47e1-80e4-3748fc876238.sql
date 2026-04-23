ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_disease_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are readable by everyone"
ON public.articles
FOR SELECT
USING (status = 'published');

CREATE POLICY "Authors are readable by everyone"
ON public.authors
FOR SELECT
USING (true);

CREATE POLICY "Categories are readable by everyone"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Symptoms are readable by everyone"
ON public.symptoms
FOR SELECT
USING (true);

CREATE POLICY "Article relations are readable by everyone"
ON public.article_relations
FOR SELECT
USING (true);

CREATE POLICY "Symptom mappings are readable by everyone"
ON public.symptom_disease_map
FOR SELECT
USING (true);

CREATE POLICY "Users can view their own saved articles"
ON public.saved_articles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can save their own articles"
ON public.saved_articles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own saved articles"
ON public.saved_articles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);