"use client";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, TagInput } from "emblor";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUploader from "@/components/imageUploader";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ContentLayout } from "@/components/staff-panel/content-layout";
import { useBlogBySlug } from "@/hooks/use-blog";
import { useTag } from "@/hooks/use-tag";
import { AutoComplete } from "@/components/autocomplete";
import { useCategorySearch } from "@/hooks/use-category";
const BlogSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be longer than or equal to 5 characters" }),
  thumbnail: z.instanceof(File).optional().nullable(),
  description: z.string().min(1, { message: "Description is required." }),
  tags: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  category: z.string().min(1, { message: "Category is required." }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UpdateBlogs() {
  const searchParams = useSearchParams();

  const slug = searchParams.get("slug") || "";
  const { blog, isLoading: blogLoading, mutate } = useBlogBySlug(slug);

  const form = useForm<z.infer<typeof BlogSchema>>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: blog?.title || "",
      thumbnail: undefined,
      description: blog?.description || "",
      tags: blog?.tags || [],
      category: blog?.category || "",
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        thumbnail: undefined,
        description: blog.description,
        tags: blog.tags || [],
        category: blog.category,
      });
    }

    setTags(blog.tags || []);
  }, [blog, form]);

  const { autocompleteTags } = useTag();
  const [tags, setTags] = useState<Tag[]>(blog?.tags || []);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const { categories, isLoading } = useCategorySearch(form.watch("category"));

  async function onSubmit(data: z.infer<typeof BlogSchema>) {
    setLoading(true);
    const formData = new FormData();
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("tags", JSON.stringify(data.tags));
    formData.append("category_name", data.category);

    try {
      const { data: blogData } = await axios.patch(
        `/contents/blogs/${blog?.uuid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success!",
        description: blogData.message,
      });

      mutate();
      router.push("/staff/blogs");
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        toast({
          title: "Error!",
          description:
            error?.response.data.error ||
            error?.response.data.message ||
            "An error occurred while add the blog.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (blogLoading || !blog) return <h1>loading...</h1>;

  return (
    <ContentLayout title="">
      <div className="md:container">
        <h1 className="font-semibold mb-4">Update Blog</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="p-0">
                <div className="m-8 space-y-4">
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={() => (
                      <ImageUploader
                        onChange={(file) => form.setValue("thumbnail", file)}
                        initialImage={blog?.thumbnail}
                        ratioImage={16 / 9}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="New blog title here..."
                            className="outline-none w-full text-4xl font-bold placeholder:text-slate-700 h-full resize-none overflow-hidden"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AutoComplete
                            selectedValue={form.watch("category")}
                            onSelectedValueChange={(value) =>
                              field.onChange(value)
                            }
                            searchValue={field.value}
                            onSearchValueChange={field.onChange}
                            items={categories ?? []}
                            isLoading={isLoading}
                            placeholder="Category name here..."
                            emptyMessage="No category found."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TagInput
                            {...field}
                            tags={tags}
                            setTags={(newTags) => {
                              setTags(newTags);
                              form.setValue("tags", newTags as [Tag, ...Tag[]]);
                            }}
                            placeholder="Add up to 4 tags..."
                            styleClasses={{
                              input:
                                "w-full h-fit outline-none border-none shadow-none  text-base p-0",
                              inlineTagsContainer: "border-none p-0",
                              autoComplete: {
                                command: "[&>div]:border-none",
                                popoverContent: "p-4",
                                commandList: "list-none",
                                commandGroup: "font-bold",
                              },
                            }}
                            enableAutocomplete={true}
                            autocompleteOptions={autocompleteTags}
                            restrictTagsToAutocompleteOptions={true}
                            activeTagIndex={activeTagIndex}
                            setActiveTagIndex={setActiveTagIndex}
                            maxTags={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MinimalTiptapEditor
                          {...field}
                          className="w-full"
                          editorContentClassName="px-8 py-4 shadow-none"
                          output="html"
                          placeholder="Type your description here..."
                          autofocus={true}
                          editable={true}
                          editorClassName="focus:outline-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Button className="mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> {`Updating...`}
                </>
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </ContentLayout>
  );
}