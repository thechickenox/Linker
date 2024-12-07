import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozwukofgopmmfdyftmpd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96d3Vrb2Znb3BtbWZkeWZ0bXBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjc2OTQzMywiZXhwIjoyMDQ4MzQ1NDMzfQ.IQ9T3wMMhGHJiIT7pRtth4b5PTAVAEJs3-UZRxqr_Ng'
export const supabase = createClient(supabaseUrl, supabaseKey)