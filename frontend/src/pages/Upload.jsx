import { useState } from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Upload as UploadIcon,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function Upload() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateFile = (file, field) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return `${field} must be PDF or DOCX`;
    }
    if (file.size > maxSize) {
      return `${field} must be less than 5MB`;
    }
    return null;
  };

  const handleFileChange = (field, file) => {
    if (file) {
      const error = validateFile(file, field);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        return;
      }
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (field === "resume") setResume(file);
    else setJobDescription(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!resume) newErrors.resume = "Resume is required";
    if (!jobDescription) newErrors.jobDescription = "Job description is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Match created successfully!",
        description: "Analysis is in progress.",
      });

      navigate(`/match/${res.data._id || res.data.id}`);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error?.response?.data || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload your resume and job description for AI-powered ATS analysis
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              PDF or DOCX, max 5MB each
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label>Resume</Label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  id="resume"
                  onChange={e =>
                    handleFileChange("resume", e.target.files[0])
                  }
                />

                <label htmlFor="resume" className="cursor-pointer block border-2 border-dashed p-8 rounded-lg text-center">
                  {resume ? (
                    <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                  ) : (
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  )}
                  <p className="mt-2">
                    {resume ? resume.name : "Click to upload resume"}
                  </p>
                </label>

                {errors.resume && (
                  <p className="text-sm text-destructive">{errors.resume}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  id="jobDescription"
                  onChange={e =>
                    handleFileChange("jobDescription", e.target.files[0])
                  }
                />

                <label htmlFor="jobDescription" className="cursor-pointer block border-2 border-dashed p-8 rounded-lg text-center">
                  {jobDescription ? (
                    <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                  ) : (
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  )}
                  <p className="mt-2">
                    {jobDescription
                      ? jobDescription.name
                      : "Click to upload job description"}
                  </p>
                </label>

                {errors.jobDescription && (
                  <p className="text-sm text-destructive">
                    {errors.jobDescription}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading & Analyzing...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-5 w-5" />
                    Upload & Analyze
                  </>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
