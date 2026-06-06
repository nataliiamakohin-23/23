-- Dumps table
CREATE TABLE IF NOT EXISTS public.dumps (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TYPE public.task_priority AS ENUM ('must', 'nice');
CREATE TYPE public.task_status   AS ENUM ('inbox', 'today', 'later', 'done');

CREATE TABLE IF NOT EXISTS public.tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          text NOT NULL,
  priority       public.task_priority NOT NULL DEFAULT 'nice',
  duration_min   integer,
  deadline       date,
  status         public.task_status NOT NULL DEFAULT 'inbox',
  scheduled_date date,
  completed_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  raw_dump_id    uuid REFERENCES public.dumps(id) ON DELETE SET NULL
);

-- RLS: users see only their own rows
ALTER TABLE public.dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dumps: own rows" ON public.dumps
  USING (user_id = auth.uid());

CREATE POLICY "tasks: own rows" ON public.tasks
  USING (user_id = auth.uid());

CREATE POLICY "dumps: insert own" ON public.dumps
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "tasks: insert own" ON public.tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "tasks: update own" ON public.tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "tasks: delete own" ON public.tasks
  FOR DELETE USING (user_id = auth.uid());
