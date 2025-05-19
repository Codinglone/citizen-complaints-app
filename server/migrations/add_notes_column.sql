-- Migration to add notes column to complaint table

-- Check if column exists first to make it idempotent
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'complaint' 
        AND column_name = 'notes'
    ) THEN
        -- Add the notes column
        ALTER TABLE complaint 
        ADD COLUMN notes TEXT;
        
        RAISE NOTICE 'Added notes column to complaint table';
    ELSE
        RAISE NOTICE 'Column notes already exists in complaint table';
    END IF;
END
$$;