import { createClient } from "@supabase/supabase-js";
import { characterNote } from "../general/types";
import { v4 } from "uuid";
import React from "react";
import { appLoadExtension } from "../general/constants";

const supabaseUrl = "https://buakfixqycjbbjeljnqn.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("No Supabase Key defined");
}
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("supabase", supabase);

type shareScriptProps = {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  title: string;
  notes?: string;
  characterNotes?: characterNote[];
  setScriptShareLink: (link: string) => void;
};

export const shareScript = async ({
  contentRef,
  title,
  notes,
  characterNotes,
  setScriptShareLink,
}: shareScriptProps) => {
  // Insert the script, return the id
  const id = v4();

  const { data, error } = await supabase.from("shared_scripts").insert([
    {
      id,
      title,
      html: contentRef.current?.innerHTML,
      notes,
      character_notes: JSON.stringify(characterNotes),
    },
  ]);

  if (error) {
    console.log("error", error);
    throw error;
  }
  console.log("ID: ", id);
  const linkUrl = appLoadExtension + id;
  // prompt the user, and put link in clipboard
  navigator.clipboard.writeText(linkUrl);
  setScriptShareLink(linkUrl);
  return;
};

export const getSharedScript = async (id: string) => {
  const { data, error } = await supabase
    .from("shared_scripts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("error", error);
    throw error;
  }
  console.log("data", data);
  return data;
};
