--
-- PostgreSQL database dump
--

\restrict 8gh8Kqgh0riQL5TAvYb0GFwqITQsBeGqxAFmAkgPB1QwY3h9XJcGWqvZCtPTqhv

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.post_credits DROP CONSTRAINT IF EXISTS post_credits_employer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_employer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.job_postings DROP CONSTRAINT IF EXISTS job_postings_employer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employer_profiles DROP CONSTRAINT IF EXISTS employer_profiles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employer_profiles DROP CONSTRAINT IF EXISTS employer_profiles_referred_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.agent_profiles DROP CONSTRAINT IF EXISTS agent_profiles_user_id_fkey;
DROP INDEX IF EXISTS public.ix_users_id;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_subscription_plans_id;
DROP INDEX IF EXISTS public.ix_post_credits_id;
DROP INDEX IF EXISTS public.ix_post_credits_employer_id;
DROP INDEX IF EXISTS public.ix_payment_transactions_razorpay_payment_id;
DROP INDEX IF EXISTS public.ix_payment_transactions_razorpay_order_id;
DROP INDEX IF EXISTS public.ix_payment_transactions_id;
DROP INDEX IF EXISTS public.ix_otp_verifications_id;
DROP INDEX IF EXISTS public.ix_otp_verifications_email;
DROP INDEX IF EXISTS public.ix_job_postings_title;
DROP INDEX IF EXISTS public.ix_job_postings_reference_number;
DROP INDEX IF EXISTS public.ix_job_postings_id;
DROP INDEX IF EXISTS public.ix_job_postings_category;
DROP INDEX IF EXISTS public.ix_job_categories_name;
DROP INDEX IF EXISTS public.ix_job_categories_id;
DROP INDEX IF EXISTS public.ix_employer_profiles_id;
DROP INDEX IF EXISTS public.ix_agent_profiles_referral_code;
DROP INDEX IF EXISTS public.ix_agent_profiles_id;
DROP INDEX IF EXISTS public.ix_activity_logs_user_role;
DROP INDEX IF EXISTS public.ix_activity_logs_user_email;
DROP INDEX IF EXISTS public.ix_activity_logs_id;
DROP INDEX IF EXISTS public.ix_activity_logs_entity_type;
DROP INDEX IF EXISTS public.ix_activity_logs_entity_id;
DROP INDEX IF EXISTS public.ix_activity_logs_created_at;
DROP INDEX IF EXISTS public.ix_activity_logs_action;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.post_credits DROP CONSTRAINT IF EXISTS post_credits_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_verifications DROP CONSTRAINT IF EXISTS otp_verifications_pkey;
ALTER TABLE IF EXISTS ONLY public.job_postings DROP CONSTRAINT IF EXISTS job_postings_pkey;
ALTER TABLE IF EXISTS ONLY public.job_categories DROP CONSTRAINT IF EXISTS job_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.employer_profiles DROP CONSTRAINT IF EXISTS employer_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.agent_profiles DROP CONSTRAINT IF EXISTS agent_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.subscription_plans;
DROP TABLE IF EXISTS public.post_credits;
DROP TABLE IF EXISTS public.payment_transactions;
DROP TABLE IF EXISTS public.otp_verifications;
DROP TABLE IF EXISTS public.job_postings;
DROP TABLE IF EXISTS public.job_categories;
DROP TABLE IF EXISTS public.employer_profiles;
DROP TABLE IF EXISTS public.agent_profiles;
DROP TABLE IF EXISTS public.activity_logs;
DROP TYPE IF EXISTS public.roleenum;
--
-- Name: roleenum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.roleenum AS ENUM (
    'SUPER_USER',
    'EMPLOYER',
    'AGENT'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id character varying NOT NULL,
    created_at timestamp without time zone,
    user_id character varying,
    user_email character varying,
    user_role character varying,
    action character varying NOT NULL,
    entity_type character varying,
    entity_id character varying,
    details character varying NOT NULL,
    ip_address character varying
);


--
-- Name: agent_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agent_profiles (
    id character varying NOT NULL,
    user_id character varying,
    referral_code character varying,
    phone character varying,
    dob character varying,
    profile_pic character varying,
    doc_type character varying,
    doc_number character varying,
    payout_type character varying,
    upi_id character varying,
    bank_name character varying,
    account_holder character varying,
    account_number character varying,
    ifsc_code character varying,
    micr_code character varying
);


--
-- Name: employer_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employer_profiles (
    id character varying NOT NULL,
    user_id character varying,
    company_name character varying,
    industry character varying,
    city character varying,
    whatsapp_number character varying,
    logo character varying,
    address character varying,
    default_message character varying,
    is_verified boolean,
    status character varying,
    subscription_plan character varying,
    subscription_status character varying,
    suspension_reason character varying,
    referred_by_id character varying
);


--
-- Name: job_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_categories (
    id character varying NOT NULL,
    name character varying NOT NULL
);


--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_postings (
    id character varying NOT NULL,
    reference_number character varying,
    title character varying NOT NULL,
    company character varying NOT NULL,
    location character varying NOT NULL,
    salary character varying NOT NULL,
    min_salary character varying,
    type character varying,
    category character varying NOT NULL,
    description character varying,
    requirements character varying,
    is_urgent boolean,
    is_featured boolean,
    status character varying,
    views_count integer NOT NULL,
    applications_count integer NOT NULL,
    employer_id character varying,
    created_at timestamp without time zone,
    moderation_reason character varying,
    appeal_text character varying,
    appeal_status character varying,
    classified_heading character varying(255),
    salary_min integer,
    salary_max integer,
    salary_period character varying(50) DEFAULT 'year'::character varying,
    used_paid_credit boolean DEFAULT false
);


--
-- Name: otp_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_verifications (
    id character varying NOT NULL,
    email character varying NOT NULL,
    otp_code character varying NOT NULL,
    purpose character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone
);


--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_transactions (
    id character varying NOT NULL,
    employer_id character varying,
    razorpay_order_id character varying NOT NULL,
    razorpay_payment_id character varying,
    razorpay_signature character varying,
    amount integer NOT NULL,
    credits_purchased integer NOT NULL,
    status character varying,
    created_at timestamp without time zone
);


--
-- Name: post_credits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_credits (
    id character varying NOT NULL,
    employer_id character varying,
    credits integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id character varying NOT NULL,
    name character varying NOT NULL,
    tagline character varying,
    price character varying NOT NULL,
    period character varying,
    features character varying
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    full_name character varying,
    role public.roleenum,
    created_at timestamp without time zone
);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, created_at, user_id, user_email, user_role, action, entity_type, entity_id, details, ip_address) FROM stdin;
782d8eec-17d6-499e-9a8d-abd51c5c8676	2026-07-28 11:43:31.106752	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
925153fc-9a40-42b4-85ed-a4744432beb3	2026-07-28 11:48:04.636522	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
55573c7e-0090-4b13-a3dd-064ab5e2d518	2026-07-28 11:49:41.090198	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	category_create	category	302d499d-bf16-46a3-8bea-4b65e254342d	Super Admin created new category: 'Aesthetics & Design'	\N
53487d6d-51e4-459d-b33c-e61e1a6d9394	2026-07-28 12:04:15.309959	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	category_delete	category	302d499d-bf16-46a3-8bea-4b65e254342d	Super Admin deleted category: 'Aesthetics & Design'	\N
e4aabb1c-5501-4f75-aff2-d92907127a68	2026-07-28 21:15:41.859598	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
5fc88ccc-52b2-4693-a8e8-9ad13b0b7521	2026-07-28 21:50:34.806555	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	user_login	user	d1821e5e-969c-4ea8-9754-e4cf9d257c91	User logged in successfully: 'amit@apexinnovations.com' (Role: EMPLOYER)	\N
eeac21bf-d10f-446f-9114-237b2cfd3ce8	2026-07-28 21:58:08.57601	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
43c11c23-13ba-4212-924e-e714634e617b	2026-07-28 21:58:10.211422	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
cd9d06b4-9f5b-424b-8c64-034af2d1cc83	2026-07-28 21:58:11.135235	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
15011519-c516-4a60-9c2a-ae0cb860b5ee	2026-07-29 12:10:23.015062	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
b63f55d0-796e-4ceb-9ad9-c0ef8ffdf8d2	2026-07-29 12:12:02.456163	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	user_login	user	d1821e5e-969c-4ea8-9754-e4cf9d257c91	User logged in successfully: 'amit@apexinnovations.com' (Role: EMPLOYER)	\N
a1892359-d1c4-47b9-8109-b0b27036eea6	2026-07-29 12:12:47.594413	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
2a34e3c3-1229-4231-9a23-153bf0a8ef8f	2026-07-30 13:05:22.904253	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	user_login	user	d1821e5e-969c-4ea8-9754-e4cf9d257c91	User logged in successfully: 'amit@apexinnovations.com' (Role: EMPLOYER)	\N
335836a5-7e83-4864-8211-4bf84c4be366	2026-07-30 14:46:42.688934	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
0e348460-9d02-4fea-9f59-8211e69fd670	2026-07-30 14:46:43.971661	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
948936ca-42fa-4cad-bdac-80284d0c46ec	2026-07-30 14:46:45.374303	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
8fefe45b-649a-4ae5-8314-6f8f912c87d6	2026-07-30 15:05:37.296032	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
ec7f67b9-9129-4c1c-8a76-d6260a318bd0	2026-07-30 15:07:35.160977	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	user_login	user	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	User logged in successfully: 'ananya@healthify.in' (Role: EMPLOYER)	\N
6cc79291-36a2-412b-9057-c44a52aaa94c	2026-07-30 15:08:31.929769	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	job_update	job	bd8bab89-8bb4-4ca5-b636-86cc65a3055c	User updated job details for: 'Healthcare Data Analyst' (JOB-RK5OQY)	\N
b95e37f1-5dcf-4420-b20c-39fd4ec71ee7	2026-07-30 15:14:27.207834	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	job_update	job	bd8bab89-8bb4-4ca5-b636-86cc65a3055c	User updated job details for: 'Healthcare Data Analyst' (JOB-RK5OQY)	\N
5a83b723-d77a-47a7-9c83-caee75f725e3	2026-07-30 15:22:42.430947	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	job_update	job	bd8bab89-8bb4-4ca5-b636-86cc65a3055c	User updated job details for: 'Healthcare Data Analyst' (JOB-RK5OQY)	\N
7fa3f812-34c9-42d5-ac3c-ad526c88424c	2026-07-30 15:23:08.173809	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	job_update	job	bd8bab89-8bb4-4ca5-b636-86cc65a3055c	User updated job details for: 'Healthcare Data Analyst' (JOB-RK5OQY)	\N
2121fa20-e7ba-4270-92d7-b1afb7cd5b5d	2026-07-30 15:23:47.915787	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	EMPLOYER	job_update	job	bd8bab89-8bb4-4ca5-b636-86cc65a3055c	User updated job details for: 'Healthcare Data Analyst' (JOB-RK5OQY)	\N
b7972775-deee-4578-b95e-1d24a7a99341	2026-07-31 11:42:01.487338	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	praful101nayak@gmail.com	AGENT	user_register	user	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	New user registered: 'praful101nayak@gmail.com' (Role: AGENT)	\N
1a338adf-8ee5-44f5-ad44-094f407c73f1	2026-07-31 11:42:26.343877	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	praful101nayak@gmail.com	AGENT	user_login	user	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	User logged in successfully: 'praful101nayak@gmail.com' (Role: AGENT)	\N
f479b770-2f24-4424-a05c-1650951c2b0a	2026-07-31 11:44:32.224013	1ae36c8c-0b44-4615-8b49-0cc7ef535a69	vp@gmail.com	EMPLOYER	user_register	user	1ae36c8c-0b44-4615-8b49-0cc7ef535a69	New user registered: 'vp@gmail.com' (Role: EMPLOYER)	\N
b86b4efa-bd7b-44ff-ba25-cf81f9ce37ae	2026-07-31 11:44:43.959262	1ae36c8c-0b44-4615-8b49-0cc7ef535a69	vp@gmail.com	EMPLOYER	user_login	user	1ae36c8c-0b44-4615-8b49-0cc7ef535a69	User logged in successfully: 'vp@gmail.com' (Role: EMPLOYER)	\N
4f454253-d39d-49e3-a7b2-f335ca6b3428	2026-08-04 14:35:23.243194	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	praful101nayak@gmail.com	AGENT	user_login	user	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	User logged in successfully: 'praful101nayak@gmail.com' (Role: AGENT)	\N
474eae1c-1849-44d0-93c1-7d9c9eb5fee2	2026-08-04 14:39:04.222307	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	user_register	user	2294aca1-9dd2-4a77-8d19-73d4120580c0	New user registered: 'test@gmail.com' (Role: EMPLOYER)	\N
783b44f4-007d-4666-bccf-b3a9677f5678	2026-08-04 14:39:42.704249	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	user_login	user	2294aca1-9dd2-4a77-8d19-73d4120580c0	User logged in successfully: 'test@gmail.com' (Role: EMPLOYER)	\N
b2a9410a-0f35-43bd-b306-735852f54a7e	2026-08-04 14:57:36.30819	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	job_create	job	adfa579f-114f-4bcc-8271-070d4443190f	Employer 'Test Employer' posted a new job: 'test 3' (JOB-J7OCHQ)	\N
de471331-fd97-46ea-b678-808a0416bd31	2026-08-04 14:40:40.275131	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
a3c27c20-e220-4c7f-8794-f90e4a9cdb5d	2026-08-04 14:40:49.221435	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	employer_verify	employer	8ac8cbfe-234b-4c9c-9316-faf1e9df1049	Super Admin verified employer workspace: 'Test Employer'	\N
c224c5a7-2d7c-4f36-99d5-b9504f1957f5	2026-08-04 14:47:27.257767	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	job_create	job	8a6c1d0f-e5a9-4a3c-8cb0-a96cbf755c5e	Employer 'Test Employer' posted a new job: 'test 1 ' (JOB-F85OUV)	\N
ade56e35-60ff-43fd-84f8-b7ac2ae47e34	2026-08-04 14:47:46.172967	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	job_create	job	107e5287-bda4-466f-a149-83aaf14d0134	Employer 'Test Employer' posted a new job: 'test 2 ' (JOB-WB7C0T)	\N
7027f45f-6012-44c2-9be4-5bc1f8b99465	2026-08-04 14:48:03.162662	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	job_delete	job	107e5287-bda4-466f-a149-83aaf14d0134	User marked job 'test 2 ' (JOB-WB7C0T) as Deleted	\N
ceb99e69-15d1-4e88-a625-9e312857f8a0	2026-08-04 14:59:23.767452	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	payment_verify	payment	23683d0b-3be4-4308-826d-ca0213c1049e	Employer 'Test Employer' purchased 10 credits for INR 699 (Status: Paid)	\N
0c5ed93e-3abb-4da2-a07f-bc2a4d16822a	2026-08-04 14:59:48.611026	2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	EMPLOYER	job_create	job	f8574fb0-3622-4e23-aa00-46a21cbd9ba9	Employer 'Test Employer' posted a new job: 'test 4' (JOB-5YZ7E4)	\N
a46ce347-e772-4e9f-889d-f075fd000354	2026-08-05 11:42:03.662798	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	user_register	user	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	New user registered: 'test@emp.com' (Role: EMPLOYER)	\N
360f7317-545b-4b69-a829-e2517ff593d4	2026-08-05 11:42:14.837233	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	user_login	user	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	User logged in successfully: 'test@emp.com' (Role: EMPLOYER)	\N
6909b10c-38ec-4784-8138-b62360358aae	2026-08-05 11:42:55.345175	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
dd36a60c-8a73-4cd1-a080-9f7c6464dbee	2026-08-05 11:43:03.268814	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	employer_verify	employer	d21a3237-d46a-42ec-88f7-1c1503b389f7	Super Admin verified employer workspace: 'test emp'	\N
13114b45-04bf-4c29-a6b2-a639115105fb	2026-08-05 11:43:29.57579	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	job_create	job	8b0a3c5e-f7ed-4106-9383-7eb0ff3867a0	Employer 'test emp' posted a new job: 'test 1' (JOB-L4HMZH)	\N
e8a52d95-a65e-4705-afd6-968d6df15c32	2026-08-05 11:43:52.966778	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	job_create	job	9fa6175f-9d7a-4318-840a-5a61a637b285	Employer 'test emp' posted a new job: 'test 2' (JOB-340S7I)	\N
66f8f264-9b32-4fcd-ad39-8411394596bc	2026-08-05 11:44:13.209521	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	job_create	job	ed050b20-ba2e-413e-a753-7c622427593d	Employer 'test emp' posted a new job: 'test 3 ' (JOB-9UTBVW)	\N
f81f4c7a-c2c8-4fdc-8f9a-2c441a40d91b	2026-08-05 11:45:53.99519	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	payment_verify	payment	b97db4be-3eff-42b3-a981-265dc191755b	Employer 'test emp' purchased 5 credits for INR 399 (Status: Paid)	\N
19f08837-bcdc-46d7-863c-ae075b3f9896	2026-08-05 11:46:09.609051	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	EMPLOYER	job_create	job	a28439c7-e8ff-4d1d-86b4-98bccebec100	Employer 'test emp' posted a new job: 'test 4 ' (JOB-ZHJZMS)	\N
22315276-d58f-40e6-a4de-6bec230f09a7	2026-08-10 14:08:35.333194	32a92394-7ae7-42a5-b4bc-8eda24a0fb64	vikram@logiroute.com	EMPLOYER	user_login	user	32a92394-7ae7-42a5-b4bc-8eda24a0fb64	User logged in successfully: 'vikram@logiroute.com' (Role: EMPLOYER)	\N
8736ebe9-ca22-48d4-b008-ef4a62cb3840	2026-08-10 14:25:34.390826	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
330aa4c0-f058-459f-a69e-0eeb816edc73	2026-08-10 14:25:55.756352	812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	EMPLOYER	user_register	user	812d19d0-8007-4557-ac46-ed38475e19c0	New user registered: 'testemployer@startup.in' (Role: EMPLOYER)	\N
cc5c28eb-f365-44c8-aa99-e69210c61488	2026-08-10 14:26:45.104343	812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	EMPLOYER	user_login	user	812d19d0-8007-4557-ac46-ed38475e19c0	User logged in successfully: 'testemployer@startup.in' (Role: EMPLOYER)	\N
b6c762cb-04df-48ec-afd2-f989871b64a6	2026-08-10 14:26:58.941937	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	employer_verify	employer	b4e50a35-6424-4078-89d9-3bd9fae41866	Super Admin verified employer workspace: 'Test Employer'	\N
1c64be96-9290-40a3-9ca2-674a7f53dd75	2026-08-10 17:20:59.700499	812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	EMPLOYER	user_login	user	812d19d0-8007-4557-ac46-ed38475e19c0	User logged in successfully: 'testemployer@startup.in' (Role: EMPLOYER)	\N
4228057d-5c7e-4df4-b9ba-8ec8bc81fbba	2026-08-10 17:25:01.220456	812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	EMPLOYER	user_login	user	812d19d0-8007-4557-ac46-ed38475e19c0	User logged in successfully: 'testemployer@startup.in' (Role: EMPLOYER)	\N
f53f6861-d6c9-4eb3-a4a1-4facaa62bd8e	2026-08-10 17:25:05.37152	812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	EMPLOYER	job_update	job	a28439c7-e8ff-4d1d-86b4-98bccebec100	User updated job details for: 'test 4 ' (JOB-ZHJZMS)	\N
7bb560f6-4bfb-4cb8-a3bf-e8f5bb28f92b	2026-08-10 18:04:59.50298	9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	SUPER_USER	user_login	user	9ae0925e-05e1-4369-a0f6-8c199337fab4	User logged in successfully: 'admin@jobportal.com' (Role: SUPER_USER)	\N
fca9887b-c86c-4084-b8f3-0b352e7c9c88	2026-08-10 18:06:29.530075	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	user_login	user	d1821e5e-969c-4ea8-9754-e4cf9d257c91	User logged in successfully: 'amit@apexinnovations.com' (Role: EMPLOYER)	\N
c4a13b0b-6ac2-4108-a96f-9caa1ab2de83	2026-08-10 18:13:13.957628	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	2de961b3-9205-4858-9f36-3a9ee713ba04	User updated job details for: 'Senior React Developer' (JOB-X6DMER)	\N
25edb964-ed44-4cc1-b4a3-15d4f3f821df	2026-08-10 18:13:15.381298	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	job_update	job	ae56248d-e4b2-45de-a105-6df34dda19f4	User updated job details for: 'DevOps Cloud Engineer' (JOB-4J9S8G)	\N
855d47a1-90aa-4736-a3b4-fa06ca97a38b	2026-08-12 13:54:02.592384	d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	EMPLOYER	user_login	user	d1821e5e-969c-4ea8-9754-e4cf9d257c91	User logged in successfully: 'amit@apexinnovations.com' (Role: EMPLOYER)	\N
\.


--
-- Data for Name: agent_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agent_profiles (id, user_id, referral_code, phone, dob, profile_pic, doc_type, doc_number, payout_type, upi_id, bank_name, account_holder, account_number, ifsc_code, micr_code) FROM stdin;
bb635fb6-7980-4e96-915a-2485dc226c7e	3c5658de-209c-4430-84f8-24bd85e6f4e6	AGENT-IND-00001	+919876543211	1988-05-15		PAN	ABCDE1234F	UPI	rajesh.malhotra@ybl	\N	\N	\N	\N	\N
0bbf35bd-3a47-4ecd-aafe-7b57dbaee696	cb72accc-0be8-48c1-a85f-d3179143a593	AGENT-IND-00002	+919876543212	1992-11-20		Aadhar	123456789012	Bank	\N	HDFC Bank	Priya Sharma	50100234567890	HDFC0000123	560240012
a8e4bc3d-118b-4e73-acd3-2e309de8ea9a	10e7b73a-9502-4be2-a6e2-23f00a4c84cc	AGENT-IND-49206	+91 9730915414	2026-04-30	https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150	Aadhar		UPI		\N	\N	\N	\N	\N
\.


--
-- Data for Name: employer_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employer_profiles (id, user_id, company_name, industry, city, whatsapp_number, logo, address, default_message, is_verified, status, subscription_plan, subscription_status, suspension_reason, referred_by_id) FROM stdin;
f4f71950-1320-4b9d-b7cb-f3a23519e5d7	d1821e5e-969c-4ea8-9754-e4cf9d257c91	Apex Innovations	Information Technology	Bangalore	+919988776655	\N	42, Tech Park Ring Rd, Bangalore	\N	t	Active	Free	Active	\N	bb635fb6-7980-4e96-915a-2485dc226c7e
c98626c1-ab46-4e0a-85a4-b3c28be08255	a2b4635e-4b89-48d8-a2d2-43a04031c43b	Quantum Labs	Artificial Intelligence	Hyderabad	+919876123456	\N	Gachibowli AI Corridor, Hyderabad	\N	t	Active	Free	Active	\N	bb635fb6-7980-4e96-915a-2485dc226c7e
bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	f2505b7b-22c1-4e34-b35b-95f9f01f68e8	Fintech Solutions Ltd	Banking & Finance	Mumbai	+918877665544	\N	Bandra Kurla Complex, Mumbai	\N	t	Active	Free	Active	\N	bb635fb6-7980-4e96-915a-2485dc226c7e
6139a852-474a-4a28-bb48-589135041a2b	8f229567-2910-4dd3-be62-f71aff702a33	CloudSphere Technologies	Cloud Infrastructure	Pune	+917766554433	\N	Hinjewadi Phase 2, Pune	\N	t	Active	Free	Active	\N	bb635fb6-7980-4e96-915a-2485dc226c7e
c0d732e2-e53b-4072-a079-8c706cb7abf3	4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	Healthify Systems	Healthcare Tech	Chennai	+916655443322	\N	OMR Tech Expressway, Chennai	\N	t	Active	Free	Active	\N	bb635fb6-7980-4e96-915a-2485dc226c7e
5b1133f9-f025-4fb6-abe6-6b4357f75337	32a92394-7ae7-42a5-b4bc-8eda24a0fb64	LogiRoute Logistics	Supply Chain & Logistics	Gurgaon	+919555123456	\N	Sector 48 Sohna Road, Gurgaon	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
6ebf42e3-f946-4826-99e9-744564f53503	b517636b-efc9-4143-a0cb-0e3435634f49	EduLearn Academy	E-Learning	Delhi	+919444123456	\N	Connaught Place, New Delhi	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2bc4ac06-93c2-4bba-927e-eccbd96edba0	Solaris Energy	Renewable Resources	Noida	+919333123456	\N	Sector 62, Noida	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
43e992ce-3160-491c-916c-4230cc98f52c	5a951655-b7c1-4f52-a3f5-833836b23e25	DesignCraft Studio	Creative & Design	Mumbai	+919222123456	\N	Andheri West, Mumbai	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
293df8d5-93fe-4e0c-ad8d-226439519f2e	4a6b386c-c1b8-40e8-9285-c0cd91b4baba	CyberShield Security	Cybersecurity	Bangalore	+919111123456	\N	Whitefield Main Road, Bangalore	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
2c2c8c61-6b9e-4796-a416-00c1c0ef0499	d823be5c-8aa8-4b69-9e5a-4229b42a4cf8	AeroTech Aerospace	Aerospace Engineering	Trivandrum	+919000123456	\N	Technopark Campus, Trivandrum	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
820661ac-2e0d-4ce6-849d-26f4d17fa857	d622fd70-76c3-44bb-a513-2e6c7abc7122	BioHealth Pharma	Pharmaceuticals	Ahmedabad	+918999123456	\N	Sarkhej-Gandhinagar Highway, Ahmedabad	\N	t	Active	Free	Active	\N	0bbf35bd-3a47-4ecd-aafe-7b57dbaee696
2e219e0f-f273-4200-af07-9318a7b59fe2	1ae36c8c-0b44-4615-8b49-0cc7ef535a69	Virendra Patil	Information Technology	Bangalore	+919730915414	https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80	demo address	Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!	f	Active	Free	Active	\N	a8e4bc3d-118b-4e73-acd3-2e309de8ea9a
8ac8cbfe-234b-4c9c-9316-faf1e9df1049	2294aca1-9dd2-4a77-8d19-73d4120580c0	Test Employer	Information Technology	Bangalore	+919876543210	https://woofcrate.ca/cdn/shop/articles/how-hot-is-too-hot-for-dogs.jpg?v=1707508527&width=2048		Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!	t	Active	Free	Active	\N	\N
d21a3237-d46a-42ec-88f7-1c1503b389f7	5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test emp	Information Technology	Bangalore	+919876543210	\N	\N	\N	t	Active	Free	Active	\N	\N
b4e50a35-6424-4078-89d9-3bd9fae41866	812d19d0-8007-4557-ac46-ed38475e19c0	Test Employer	Information Technology	Bangalore	+919876543210	\N	\N	\N	t	Active	Free	Active	\N	\N
\.


--
-- Data for Name: job_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_categories (id, name) FROM stdin;
6ae4cb77-0e87-4a63-a020-3e18372b29c7	Information Technology (IT)
ab44856e-5139-46db-993f-19f0645f1c93	Pharmaceuticals
c5022c6e-a496-4014-bac7-a493c85c3ef3	Supply Chain & Logistics
32f53490-b724-4562-8125-94e5320cad66	Finance & Accounting
6f8c2921-a557-4281-90f2-527896612e21	Renewable Resources
ac6a7577-6cef-4246-b095-85a15cef1a67	Energy & Utilities
7191a07e-1501-40cf-a043-dc4195685f03	Healthcare Tech
ca2bf338-b54c-4207-8dfa-833732ee2be2	Cybersecurity
f61bc112-e5d8-4ba7-b873-014334a05fe5	Biotechnology & Pharmaceuticals
77a63a3b-24f3-446b-b939-a3bef1a1daad	Design & Creative Arts
3ffda972-f087-40db-bf95-b768799702c0	Healthcare
059d4b9e-54b3-484e-9793-5c4aa93f58a5	E-Learning
5e7f68e7-85fc-4162-8f8c-10d6dbdb8edf	Transportation & Logistics
0d4d367a-244f-4309-9d18-1932a3d26b15	Education
ef5048fb-758d-4961-beef-aa47ec941b8c	Human Resources
1417a2fb-4af1-4128-a2d4-9a0b045d807f	Sales & Marketing
43ca9599-f1c7-4214-bfad-6e88059ce563	Content Writing
8a57fbb3-beb9-48c4-b35d-b512cf05166f	Engineering
88d7973e-1a93-4963-b623-001e8463d41b	Aerospace Engineering
4c31cfb0-86fe-43a5-aebc-5c0408d01181	Freelance & Gig Economy
\.


--
-- Data for Name: job_postings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_postings (id, reference_number, title, company, location, salary, min_salary, type, category, description, requirements, is_urgent, is_featured, status, views_count, applications_count, employer_id, created_at, moderation_reason, appeal_text, appeal_status, classified_heading, salary_min, salary_max, salary_period, used_paid_credit) FROM stdin;
1aa4aa93-0c85-4231-b587-d7468acc52ef	JOB-SBI7CP	Frontend Engineering Intern	Apex Innovations	Bangalore	₹25,000 / month	\N	Internship	Freelance & Gig Economy	Assist the frontend squad in building reusable component libraries and writing unit tests. Ideal for final-year CS students eager to learn React and Next.js.	Pursuing B.Tech/MCA, basic knowledge of HTML, CSS, JavaScript.	f	f	Active	226	39	f4f71950-1320-4b9d-b7cb-f3a23519e5d7	2026-07-04 11:36:01.483997	\N	\N	\N	\N	\N	\N	year	f
f2f96dfa-7d10-4dca-b7c5-c65c7da38d9e	JOB-Q1Z4J3	Staff Full-Stack Engineer	Apex Innovations	Bangalore	₹24,00,000 - ₹35,00,000 PA	\N	Full-time	Information Technology (IT)	Own end-to-end feature delivery across the Node.js API layer and React front end. Mentor mid-level engineers, participate in architecture reviews, and drive technical standards.	8+ years full-stack, strong system design skills, experience leading squads.	t	f	Active	308	41	f4f71950-1320-4b9d-b7cb-f3a23519e5d7	2026-07-04 11:36:01.484036	\N	\N	\N	\N	\N	\N	year	f
f6b9bf74-cde2-49c2-92e8-cbd67ef2963e	JOB-MKVV2L	UI/UX Designer	Apex Innovations	Bangalore	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Design & Creative Arts	Conduct user research, create wireframes, high-fidelity prototypes, and design systems in Figma. Work closely with engineers to ensure design-to-code fidelity.	2+ years in product design, strong Figma portfolio, understanding of accessibility guidelines.	f	f	Active	234	6	f4f71950-1320-4b9d-b7cb-f3a23519e5d7	2026-07-12 11:36:01.484074	\N	\N	\N	\N	\N	\N	year	f
b80b8e6a-2ee0-4ba4-8c54-66f0b2483926	JOB-C02H5U	Machine Learning Engineer	Quantum Labs	Hyderabad	₹18,00,000 - ₹28,00,000 PA	\N	Full-time	Information Technology (IT)	Design, train, and deploy production-grade ML models. Build feature engineering pipelines and integrate models into low-latency serving infrastructure.	3+ years ML, proficiency in Python/PyTorch, MLOps experience preferred.	t	t	Active	395	28	c98626c1-ab46-4e0a-85a4-b3c28be08255	2026-07-14 11:36:01.484111	\N	\N	\N	\N	\N	\N	year	f
19bc2fb2-03a3-436a-9b36-db18d6511ea8	JOB-GUIY1J	Data Scientist – Recommendation Systems	Quantum Labs	Hyderabad	₹14,00,000 - ₹22,00,000 PA	\N	Full-time	Information Technology (IT)	Develop collaborative filtering and content-based recommendation engines. Analyze A/B test results and drive measurable improvements in user engagement metrics.	2+ years data science, strong SQL, experience with Spark or Flink.	f	t	Active	50	9	c98626c1-ab46-4e0a-85a4-b3c28be08255	2026-07-04 11:36:01.48415	\N	\N	\N	\N	\N	\N	year	f
9d5d4260-f6a4-4615-b21e-c803d0eb9cdf	JOB-7F0AGZ	NLP Research Scientist	Quantum Labs	Hyderabad	₹20,00,000 - ₹30,00,000 PA	\N	Full-time	Information Technology (IT)	Push the boundaries of transformer-based language models. Publish research, prototype novel architectures, and collaborate with the product team on LLM-powered features.	PhD or equivalent experience in NLP, publications in ACL/EMNLP/NeurIPS.	f	f	Active	114	79	c98626c1-ab46-4e0a-85a4-b3c28be08255	2026-06-30 11:36:01.484195	\N	\N	\N	\N	\N	\N	year	f
115d50a5-b02f-47ef-a7bd-fa69bef6de8b	JOB-XLKJF2	AI Product Manager	Quantum Labs	Hyderabad	₹22,00,000 - ₹32,00,000 PA	\N	Full-time	Information Technology (IT)	Define the product roadmap for AI-driven features. Translate business goals into technical requirements, coordinate cross-functional teams, and own KPI dashboards.	6+ years PM experience, technical background, familiarity with ML lifecycle.	t	f	Active	333	5	c98626c1-ab46-4e0a-85a4-b3c28be08255	2026-06-29 11:36:01.484229	\N	\N	\N	\N	\N	\N	year	f
cc892cc7-f270-4663-9494-a9724c8504a8	JOB-ESIFG8	Python Backend Intern	Quantum Labs	Hyderabad	₹30,000 / month	\N	Internship	Freelance & Gig Economy	Support the backend team in building FastAPI services, writing integration tests, and automating data ingestion workflows. Great exposure to production-grade Python.	Final-year student, comfortable with Python, basic understanding of REST APIs.	f	f	Active	289	62	c98626c1-ab46-4e0a-85a4-b3c28be08255	2026-07-08 11:36:01.484261	\N	\N	\N	\N	\N	\N	year	f
c4ac71ab-6c99-4d8d-915e-d70944c72188	JOB-G11XKB	Java Backend Tech Lead	Fintech Solutions Ltd	Mumbai	₹25,00,000 - ₹38,00,000 PA	\N	Full-time	Information Technology (IT)	Lead the core banking microservices team. Design event-driven architectures on Kafka, ensure PCI-DSS compliance, and oversee code quality across 8 services.	7+ years Java, Spring Boot expertise, experience in regulated fintech environments.	t	t	Active	147	69	bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	2026-07-08 11:36:01.484296	\N	\N	\N	\N	\N	\N	year	f
fd2b1e96-ef82-41f0-8589-2699af4478d7	JOB-G51WUV	Quantitative Analyst	Fintech Solutions Ltd	Mumbai	₹20,00,000 - ₹35,00,000 PA	\N	Full-time	Finance & Accounting	Build pricing models for derivatives, perform Monte Carlo simulations, and develop risk analytics dashboards for the trading desk.	M.Sc./PhD in Mathematics or Finance, strong Python/R skills, knowledge of Black-Scholes.	f	t	Active	183	21	bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	2026-07-11 11:36:01.484332	\N	\N	\N	\N	\N	\N	year	f
23f8ac1b-435e-43bc-b62b-33442c8c2a95	JOB-WA18UI	Financial Risk Manager	Fintech Solutions Ltd	Mumbai	₹15,00,000 - ₹25,00,000 PA	\N	Full-time	Finance & Accounting	Assess credit, market, and operational risks. Prepare regulatory filings for RBI compliance and implement stress-testing frameworks.	FRM/CFA certification preferred, 4+ years in risk management.	f	f	Active	165	48	bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	2026-07-10 11:36:01.484365	\N	\N	\N	\N	\N	\N	year	f
4cba6bd0-b96b-4642-aa6e-c4545417a017	JOB-J8DURE	Database Administrator	Fintech Solutions Ltd	Mumbai	₹10,00,000 - ₹16,00,000 PA	\N	Full-time	Information Technology (IT)	Manage high-availability PostgreSQL and Oracle clusters. Optimize query performance, implement backup/recovery strategies, and enforce data-security policies.	3+ years DBA, experience with replication setups and performance tuning.	t	f	Active	219	34	bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	2026-07-04 11:36:01.484398	\N	\N	\N	\N	\N	\N	year	f
d533a51d-c67e-4e13-bb8b-c5f1d5c5e08a	JOB-H7LE6Y	QA Security Engineer	Fintech Solutions Ltd	Mumbai	₹12,00,000 - ₹20,00,000 PA	\N	Full-time	Information Technology (IT)	Perform penetration testing and security audits on payment gateways. Write automated security regression suites and collaborate with SOC teams on incident response.	3+ years security testing, OWASP expertise, CEH/OSCP certification a plus.	f	f	Active	268	28	bc64e0b3-9b48-467e-aa7b-bc2a0cb249bf	2026-07-06 11:36:01.48443	\N	\N	\N	\N	\N	\N	year	f
e18257a1-0a4f-409f-ba39-0f666a54b60e	JOB-H5LEE5	Cloud Solutions Architect	CloudSphere Technologies	Pune	₹30,00,000 - ₹45,00,000 PA	\N	Full-time	Information Technology (IT)	Design multi-cloud reference architectures for enterprise clients. Lead proof-of-concept engagements and publish technical whitepapers for the sales engineering team.	10+ years infrastructure, AWS SA Professional + Azure Architect Expert.	t	t	Active	402	6	6139a852-474a-4a28-bb48-589135041a2b	2026-07-18 11:36:01.484473	\N	\N	\N	\N	\N	\N	year	f
2de961b3-9205-4858-9f36-3a9ee713ba04	JOB-X6DMER	Senior React Developer	Apex Innovations	Bangalore	₹12,00,000 - ₹18,00,000 PA	1200000	Full-time	Information Technology (IT)	Build scalable single-page applications using React 18+, TypeScript, and modern state management libraries. Collaborate with product designers to ship pixel-perfect UIs.	3+ years with React, proficiency in TypeScript, familiarity with CI/CD pipelines.	t	f	Active	0	0	f4f71950-1320-4b9d-b7cb-f3a23519e5d7	2026-07-24 11:36:01.483857	\N	\N	\N	\N	\N	\N	year	f
11ee9ef6-deb3-4238-8f8a-f4ba27287f53	JOB-I5RCDE	AWS Support Engineer	CloudSphere Technologies	Pune	₹8,00,000 - ₹13,00,000 PA	\N	Full-time	Information Technology (IT)	Provide L2/L3 support for customers running workloads on AWS. Troubleshoot EC2, RDS, and Lambda issues, and create runbooks for common failure modes.	2+ years AWS, AWS Developer/SysOps Associate certification.	f	t	Active	374	46	6139a852-474a-4a28-bb48-589135041a2b	2026-07-05 11:36:01.484505	\N	\N	\N	\N	\N	\N	year	f
d78e2e27-f6b5-4eb6-99a8-f8974823cc87	JOB-4BUFQH	Kubernetes Platform Specialist	CloudSphere Technologies	Pune	₹16,00,000 - ₹24,00,000 PA	\N	Full-time	Information Technology (IT)	Build and operate production Kubernetes clusters using EKS/AKS. Implement service mesh (Istio), GitOps workflows (ArgoCD), and zero-downtime deployment pipelines.	4+ years K8s, CKA/CKAD certified, experience with Helm and Kustomize.	t	f	Active	433	42	6139a852-474a-4a28-bb48-589135041a2b	2026-07-07 11:36:01.484537	\N	\N	\N	\N	\N	\N	year	f
668a8f0f-0726-4fc7-af9e-16f5271957d2	JOB-U0G475	Network Security Administrator	CloudSphere Technologies	Pune	₹11,00,000 - ₹17,00,000 PA	\N	Full-time	Information Technology (IT)	Manage firewalls, VPNs, and IDS/IPS systems across cloud and on-prem networks. Conduct vulnerability assessments and enforce zero-trust network policies.	3+ years networking, CCNA/CCNP, familiarity with Palo Alto or Fortinet.	f	f	Active	336	20	6139a852-474a-4a28-bb48-589135041a2b	2026-07-14 11:36:01.484568	\N	\N	\N	\N	\N	\N	year	f
f475376f-f8f0-482d-b9b0-ea8484f73775	JOB-SOVKXH	Technical Writer – Cloud Documentation	CloudSphere Technologies	Pune	₹6,00,000 - ₹9,00,000 PA	\N	Full-time	Design & Creative Arts	Author API reference guides, migration playbooks, and developer tutorials for CloudSphere's platform. Maintain a docs-as-code pipeline using Markdown and Docusaurus.	1+ year technical writing, ability to read code in Python/Go, excellent English.	f	f	Active	248	21	6139a852-474a-4a28-bb48-589135041a2b	2026-07-20 11:36:01.484601	\N	\N	\N	\N	\N	\N	year	f
13aa9024-5a0f-452c-b62b-aced89982c91	JOB-WC7H5T	Bioinformatics Developer	Healthify Systems	Chennai	₹12,00,000 - ₹20,00,000 PA	\N	Full-time	Healthcare	Build genomic data pipelines using Python and R. Integrate with FHIR-based EHR systems and visualize patient outcome trends for clinical research teams.	2+ years bioinformatics, experience with Nextflow/Snakemake, biology domain knowledge.	t	t	Active	126	8	c0d732e2-e53b-4072-a079-8c706cb7abf3	2026-07-23 11:36:01.484633	\N	\N	\N	\N	\N	\N	year	f
52185231-5855-4d0f-a3b3-8c1948d7744d	JOB-DZY55Y	Android Healthcare App Developer	Healthify Systems	Chennai	₹10,00,000 - ₹16,00,000 PA	\N	Full-time	Information Technology (IT)	Develop and maintain a patient-facing health tracker on Android (Kotlin + Jetpack Compose). Integrate wearable APIs and ensure HIPAA-compliant data handling.	3+ years Android/Kotlin, experience with Health Connect API preferred.	f	t	Active	27	26	c0d732e2-e53b-4072-a079-8c706cb7abf3	2026-07-17 11:36:01.484668	\N	\N	\N	\N	\N	\N	year	f
f536ccc7-70b3-4753-ad9d-230eaf6573cd	JOB-VWDVX0	Compliance & Quality Officer	Healthify Systems	Chennai	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Information Technology (IT)	Ensure adherence to NABH and ISO 13485 standards. Conduct internal audits, manage CAPA processes, and liaise with regulatory bodies during inspections.	3+ years quality/compliance in healthcare, familiarity with FDA 21 CFR Part 11.	t	f	Active	393	3	c0d732e2-e53b-4072-a079-8c706cb7abf3	2026-07-01 11:36:01.484763	\N	\N	\N	\N	\N	\N	year	f
ffa244b9-d5e1-48c5-abcd-00e718fa5548	JOB-NRGO11	Systems Administrator	Healthify Systems	Chennai	₹9,00,000 - ₹14,00,000 PA	\N	Full-time	Information Technology (IT)	Manage on-prem and hybrid-cloud server infrastructure. Administer Active Directory, implement backup strategies, and ensure 99.9% uptime SLAs for hospital systems.	2+ years sysadmin, Linux + Windows Server, experience with VMware/Hyper-V.	f	f	Active	356	59	c0d732e2-e53b-4072-a079-8c706cb7abf3	2026-07-23 11:36:01.484809	\N	\N	\N	\N	\N	\N	year	f
ab821d84-fbfa-4005-92a4-de63da0f2b55	JOB-F5N6YU	Supply Chain Coordinator	LogiRoute Logistics	Gurgaon	₹6,00,000 - ₹9,00,000 PA	\N	Full-time	Transportation & Logistics	Coordinate shipments across 12 distribution centres. Negotiate with transporters, track consignments in real-time, and resolve delivery exceptions promptly.	2+ years logistics, proficiency in SAP MM, strong communication skills.	t	t	Active	443	57	5b1133f9-f025-4fb6-abe6-6b4357f75337	2026-07-04 11:36:01.484856	\N	\N	\N	\N	\N	\N	year	f
1e084a66-89ef-4ee9-a8d7-4758416654a6	JOB-84K0PJ	Logistics Route Optimisation Planner	LogiRoute Logistics	Gurgaon	₹5,00,000 - ₹8,00,000 PA	\N	Full-time	Transportation & Logistics	Use OR-based routing algorithms and fleet GPS data to optimise last-mile delivery routes, reducing fuel costs and improving on-time delivery percentages.	1+ year in route planning, analytical mindset, familiarity with GIS tools.	f	t	Active	181	66	5b1133f9-f025-4fb6-abe6-6b4357f75337	2026-07-19 11:36:01.484911	\N	\N	\N	\N	\N	\N	year	f
d344ad54-0d6d-4a85-95fa-5067656de347	JOB-FPS3RX	Warehouse Operations Lead	LogiRoute Logistics	Gurgaon	₹7,00,000 - ₹11,00,000 PA	\N	Full-time	Transportation & Logistics	Supervise a 40-member warehouse team. Implement lean 5S methodologies, manage inventory accuracy above 99.5%, and oversee WMS configuration and training.	3+ years warehouse management, experience with WMS (Manhattan/Blue Yonder).	t	f	Active	448	2	5b1133f9-f025-4fb6-abe6-6b4357f75337	2026-07-18 11:36:01.484955	\N	\N	\N	\N	\N	\N	year	f
352e1a2b-78d9-4acf-8336-53802396766e	JOB-M1NYG8	Operations Systems Analyst	LogiRoute Logistics	Gurgaon	₹11,00,000 - ₹16,00,000 PA	\N	Full-time	Information Technology (IT)	Develop internal tools and dashboards that connect TMS, WMS, and ERP systems. Automate reporting workflows and create data pipelines for operational analytics.	3+ years systems analysis, Python/SQL, experience integrating enterprise software.	f	f	Active	493	57	5b1133f9-f025-4fb6-abe6-6b4357f75337	2026-06-29 11:36:01.48499	\N	\N	\N	\N	\N	\N	year	f
78688dd8-d9b8-4320-8f93-fabe7069f59a	JOB-2WCHRU	Procurement Manager	LogiRoute Logistics	Gurgaon	₹12,00,000 - ₹18,00,000 PA	\N	Full-time	Transportation & Logistics	Source and negotiate contracts for packaging materials and fleet spare-parts. Manage vendor scorecards, drive cost-reduction initiatives, and ensure compliance with procurement policies.	5+ years procurement, strong negotiation skills, CIPS certification a plus.	f	f	Active	236	42	5b1133f9-f025-4fb6-abe6-6b4357f75337	2026-07-13 11:36:01.485025	\N	\N	\N	\N	\N	\N	year	f
c2056ffa-8489-4ccc-8342-604674cdca91	JOB-F1C1EK	Senior Curriculum Designer	EduLearn Academy	Delhi	₹9,00,000 - ₹14,00,000 PA	\N	Full-time	Education	Design outcome-based curricula for K-12 and competitive exam prep courses. Align content with NEP 2020 guidelines and incorporate gamification elements.	4+ years instructional design, experience with SCORM/xAPI, education domain expertise.	t	t	Active	217	39	6ebf42e3-f946-4826-99e9-744564f53503	2026-06-30 11:36:01.485169	\N	\N	\N	\N	\N	\N	year	f
fd72cce9-608e-4eec-bb72-af1f0b267847	JOB-QMTALJ	Instructional Video Editor	EduLearn Academy	Delhi	₹6,00,000 - ₹9,00,000 PA	\N	Full-time	Design & Creative Arts	Edit lecture recordings, add motion graphics overlays, and produce engaging 10-15 minute video lessons. Manage the post-production pipeline from raw footage to final QC.	2+ years video editing, Premiere Pro/DaVinci Resolve, basic After Effects.	f	t	Active	486	21	6ebf42e3-f946-4826-99e9-744564f53503	2026-07-27 11:36:01.48523	\N	\N	\N	\N	\N	\N	year	f
a0cb29ae-7f8d-4229-83ca-41af873f1428	JOB-YC2438	LMS Platform Developer	EduLearn Academy	Delhi	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Information Technology (IT)	Maintain and extend our custom Learning Management System built on Django. Implement progress tracking, assessment engines, and learner analytics modules.	2+ years Django/Python, REST API design, familiarity with Celery and Redis.	f	f	Active	151	14	6ebf42e3-f946-4826-99e9-744564f53503	2026-07-24 11:36:01.485316	\N	\N	\N	\N	\N	\N	year	f
8527caa1-278d-4b9f-b13c-50b8efe80908	JOB-FGLXXA	Online Tutor Coordinator	EduLearn Academy	Delhi	₹5,00,000 - ₹8,00,000 PA	\N	Full-time	Education	Manage a roster of 200+ freelance tutors. Schedule live sessions, monitor quality scores, handle escalations, and onboard new tutors onto the platform.	1+ year coordination role, excellent organisational skills, comfort with spreadsheets.	t	f	Active	422	27	6ebf42e3-f946-4826-99e9-744564f53503	2026-07-11 11:36:01.485379	\N	\N	\N	\N	\N	\N	year	f
a236b7d5-648c-495c-a0ef-4c5d766f0081	JOB-82IVVV	Academic Content Writer	EduLearn Academy	Delhi	₹4,50,000 - ₹7,00,000 PA	\N	Full-time	Design & Creative Arts	Write clear, student-friendly explanations for Mathematics and Science topics (Class 6-12). Create practice question banks with detailed step-by-step solutions.	1+ year content writing, strong grasp of CBSE/ICSE syllabus, research aptitude.	f	f	Active	57	35	6ebf42e3-f946-4826-99e9-744564f53503	2026-07-27 11:36:01.485433	\N	\N	\N	\N	\N	\N	year	f
5294a3eb-03c3-4a2e-bb09-0bbc4741fa04	JOB-GAOEMN	Renewable Energy Systems Engineer	Solaris Energy	Noida	₹14,00,000 - ₹22,00,000 PA	\N	Full-time	Energy & Utilities	Design and commission grid-tied and off-grid solar installations up to 10 MW. Perform PVsyst simulations, manage BoS procurement, and oversee site engineers.	4+ years solar EPC, P.E. license preferred, experience with SCADA systems.	t	t	Active	308	54	d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2026-07-01 11:36:01.485489	\N	\N	\N	\N	\N	\N	year	f
dcfc6880-6179-4ed7-a625-4279cff7544f	JOB-4PAZDG	Solar Grid Consultant	Solaris Energy	Noida	₹10,00,000 - ₹16,00,000 PA	\N	Full-time	Energy & Utilities	Advise utility companies on grid-integration challenges of intermittent solar generation. Conduct power-flow studies, harmonic analyses, and interconnection feasibility reports.	3+ years power systems, knowledge of IEEE 1547, PSS/E or ETAP proficiency.	f	t	Active	393	26	d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2026-07-06 11:36:01.485542	\N	\N	\N	\N	\N	\N	year	f
6dd3dbcd-b470-487d-818c-75d578d0cf05	JOB-SJL7TG	Environmental Impact Analyst	Solaris Energy	Noida	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Energy & Utilities	Prepare EIA reports for new solar and wind farm projects. Interface with MoEFCC for clearances, conduct baseline surveys, and develop mitigation plans.	2+ years environmental consulting, familiarity with EIA notification 2006.	f	f	Active	285	54	d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2026-07-21 11:36:01.485617	\N	\N	\N	\N	\N	\N	year	f
1fc0989d-63df-4cdf-a02f-0a699893a452	JOB-SNVXHZ	Power Infrastructure Project Lead	Solaris Energy	Noida	₹18,00,000 - ₹28,00,000 PA	\N	Full-time	Energy & Utilities	Manage multi-crore solar park projects from land acquisition through commissioning. Coordinate civil, electrical, and transmission work-streams and report progress to CXOs.	6+ years project management, PMP certified, EPC background mandatory.	t	f	Active	144	66	d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2026-07-13 11:36:01.485673	\N	\N	\N	\N	\N	\N	year	f
d87426a8-3c3c-495c-986a-d34ab424eb66	JOB-AY1D7P	Field Research Assistant – Solar	Solaris Energy	Noida	₹5,00,000 - ₹8,00,000 PA	\N	Full-time	Energy & Utilities	Collect on-site irradiance, temperature, and module-degradation data. Maintain weather stations, calibrate sensors, and upload data to the central SCADA database.	B.Sc./B.Tech in Physics or EE, willingness to travel to rural sites 50% of the time.	f	f	Active	371	49	d1e41d3e-96ba-46e6-8e44-f3d6e79392f7	2026-06-28 11:36:01.485727	\N	\N	\N	\N	\N	\N	year	f
d21114cb-cd6d-4734-a8c7-2e06daae5c7f	JOB-TS8BGH	Product Graphic Designer	DesignCraft Studio	Mumbai	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Design & Creative Arts	Create packaging artwork, marketing collateral, and social-media creatives for FMCG and D2C brands. Manage multiple projects simultaneously with tight turnaround times.	2+ years graphic design, expert in Illustrator + Photoshop, print production knowledge.	t	t	Active	420	69	43e992ce-3160-491c-916c-4230cc98f52c	2026-07-11 11:36:01.485788	\N	\N	\N	\N	\N	\N	year	f
ddb55703-57c6-4276-99d6-47a598b74cf6	JOB-XVUT7K	Senior Motion Graphics Artist	DesignCraft Studio	Mumbai	₹12,00,000 - ₹18,00,000 PA	\N	Full-time	Design & Creative Arts	Produce animated explainer videos, logo reveals, and interactive AR filters. Build and maintain a shared After Effects template library for the studio.	4+ years motion design, After Effects + Cinema 4D, understanding of 12 principles of animation.	f	t	Active	355	78	43e992ce-3160-491c-916c-4230cc98f52c	2026-07-10 11:36:01.485843	\N	\N	\N	\N	\N	\N	year	f
367ae923-1616-4b33-8980-ddbdae7cc627	JOB-28LLRL	UI/UX Design Lead	DesignCraft Studio	Mumbai	₹18,00,000 - ₹28,00,000 PA	\N	Full-time	Design & Creative Arts	Lead the design practice for client engagements across mobile and web. Establish design systems, mentor junior designers, and present design rationale to C-suite stakeholders.	6+ years product design, Figma design-system experience, agency background preferred.	t	f	Active	424	67	43e992ce-3160-491c-916c-4230cc98f52c	2026-07-19 11:36:01.485878	\N	\N	\N	\N	\N	\N	year	f
90c13677-f71b-4b81-a3a2-5c93c403e7b1	JOB-E5C515	Creative Art Director	DesignCraft Studio	Mumbai	₹22,00,000 - ₹35,00,000 PA	\N	Full-time	Design & Creative Arts	Set the creative vision for brand campaigns spanning digital, OOH, and experiential. Direct photo shoots, approve final artworks, and ensure brand consistency across touch-points.	8+ years creative leadership, award-winning portfolio, ability to manage a team of 6+.	f	f	Active	69	71	43e992ce-3160-491c-916c-4230cc98f52c	2026-07-16 11:36:01.485914	\N	\N	\N	\N	\N	\N	year	f
c4b94e7b-8ee6-48ef-b1fb-ee691239f7b4	JOB-YT7SOJ	3D Modeler (Blender/Maya)	DesignCraft Studio	Mumbai	₹7,00,000 - ₹11,00,000 PA	\N	Full-time	Design & Creative Arts	Model product mockups, architectural visualisations, and character assets in Blender. Optimise geometry for real-time WebGL rendering on e-commerce platforms.	1+ year 3D modelling, strong topology awareness, texture painting skills.	f	f	Active	175	61	43e992ce-3160-491c-916c-4230cc98f52c	2026-07-13 11:36:01.485959	\N	\N	\N	\N	\N	\N	year	f
328b068b-3eae-4626-8ad7-3a20ceaa35fe	JOB-OQ2OX1	Security Operations Centre Analyst	CyberShield Security	Bangalore	₹11,00,000 - ₹16,00,000 PA	\N	Full-time	Information Technology (IT)	Monitor SIEM alerts 24×7, perform triage on security incidents, and escalate confirmed threats to the IR team. Write daily shift reports and maintain playbook documentation.	3+ years SOC, experience with Splunk/QRadar, CompTIA Security+ certified.	t	t	Active	361	36	293df8d5-93fe-4e0c-ad8d-226439519f2e	2026-06-28 11:36:01.485992	\N	\N	\N	\N	\N	\N	year	f
11551702-ac16-4060-8979-ab8981dd76da	JOB-ZI76PC	Lead Penetration Tester	CyberShield Security	Bangalore	₹16,00,000 - ₹25,00,000 PA	\N	Full-time	Information Technology (IT)	Conduct red-team engagements for enterprise clients: network, web-app, and wireless pen testing. Deliver executive-ready reports with CVSS-scored findings and remediation guidance.	5+ years offensive security, OSCP/OSCE certified, scripting in Python/Bash.	f	t	Active	24	12	293df8d5-93fe-4e0c-ad8d-226439519f2e	2026-06-28 11:36:01.486157	\N	\N	\N	\N	\N	\N	year	f
0262d236-607d-4c8e-a62d-63cdecd7c293	JOB-OU5RTV	IAM Security Specialist	CyberShield Security	Bangalore	₹12,00,000 - ₹19,00,000 PA	\N	Full-time	Information Technology (IT)	Implement and manage identity and access management solutions (Okta, Azure AD). Design RBAC/ABAC policies, automate user lifecycle events, and enforce MFA across the organisation.	3+ years IAM, experience with SAML/OIDC/OAuth 2.0, scripting for automation.	f	f	Active	330	65	293df8d5-93fe-4e0c-ad8d-226439519f2e	2026-07-27 11:36:01.486215	\N	\N	\N	\N	\N	\N	year	f
052792ca-6089-4fa8-b017-acae097dc99c	JOB-B7HZK9	GRC Coordinator	CyberShield Security	Bangalore	₹14,00,000 - ₹20,00,000 PA	\N	Full-time	Information Technology (IT)	Drive ISO 27001 and SOC 2 Type II compliance programs. Maintain the risk register, coordinate internal audits, and prepare evidence packages for external assessors.	4+ years GRC, CISA/CRISC certification, experience with GRC tools like Archer or ServiceNow.	t	f	Active	421	75	293df8d5-93fe-4e0c-ad8d-226439519f2e	2026-07-13 11:36:01.486252	\N	\N	\N	\N	\N	\N	year	f
3d309fe9-9bf1-4077-8e2a-5fcd7a9698c1	JOB-7OXE0U	Network Intrusion Detection Specialist	CyberShield Security	Bangalore	₹10,00,000 - ₹15,00,000 PA	\N	Full-time	Information Technology (IT)	Deploy and tune Suricata/Zeek sensors across client networks. Analyse PCAP captures, write custom detection rules, and integrate findings into the threat-intel platform.	2+ years network security, deep TCP/IP knowledge, Snort/Suricata rule writing.	f	f	Active	100	17	293df8d5-93fe-4e0c-ad8d-226439519f2e	2026-07-17 11:36:01.486286	\N	\N	\N	\N	\N	\N	year	f
8ca6de99-63f4-4535-87d9-9bad97463a7a	JOB-CDUL89	Embedded Avionics Developer	AeroTech Aerospace	Trivandrum	₹15,00,000 - ₹24,00,000 PA	\N	Full-time	Engineering	Write DO-178C compliant embedded C/C++ firmware for flight management systems. Perform MISRA checks, HIL testing, and integrate with ARINC 429 / MIL-STD-1553 buses.	4+ years embedded systems, DO-178C DAL-A experience, RTOS (VxWorks/INTEGRITY).	t	t	Active	303	70	2c2c8c61-6b9e-4796-a416-00c1c0ef0499	2026-07-26 11:36:01.48632	\N	\N	\N	\N	\N	\N	year	f
0033f865-0780-44f9-a633-b5dd8eda1b4b	JOB-4JPA3N	Aerodynamics Consultant	AeroTech Aerospace	Trivandrum	₹18,00,000 - ₹30,00,000 PA	\N	Full-time	Engineering	Conduct CFD analyses for wing and fuselage geometries. Optimise drag coefficients through parametric studies and validate results against wind-tunnel data.	5+ years aero, proficiency in ANSYS Fluent or OpenFOAM, M.Tech in Aerospace.	f	t	Active	182	62	2c2c8c61-6b9e-4796-a416-00c1c0ef0499	2026-07-23 11:36:01.486358	\N	\N	\N	\N	\N	\N	year	f
4b8f7657-5650-46ba-af3b-7b737f26b8ce	JOB-C5YN79	Flight Control Systems Engineer	AeroTech Aerospace	Trivandrum	₹14,00,000 - ₹22,00,000 PA	\N	Full-time	Engineering	Design and verify fly-by-wire control laws using MATLAB/Simulink. Perform stability and handling-qualities analyses per MIL-HDBK-1797 and support flight-test campaigns.	3+ years controls, model-based design experience, familiarity with ARP 4754A.	t	f	Active	102	79	2c2c8c61-6b9e-4796-a416-00c1c0ef0499	2026-07-23 11:36:01.4864	\N	\N	\N	\N	\N	\N	year	f
752208bf-452b-4697-a750-69efe09b1a13	JOB-TOD2EL	RF Communication Engineer	AeroTech Aerospace	Trivandrum	₹11,00,000 - ₹17,00,000 PA	\N	Full-time	Engineering	Design satellite communication sub-systems (S-band/X-band). Perform link-budget analyses, prototype antenna feeds, and support environmental qualification testing.	2+ years RF design, familiarity with spectrum analysers and VNA, HFSS/CST experience.	f	f	Active	25	68	2c2c8c61-6b9e-4796-a416-00c1c0ef0499	2026-07-18 11:36:01.486446	\N	\N	\N	\N	\N	\N	year	f
8c1f7422-6b44-4092-92e3-967fb124a4c7	JOB-M0091Y	CAD Modelling Specialist	AeroTech Aerospace	Trivandrum	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Engineering	Create detailed 3D models and assemblies of structural airframe components in CATIA V5/NX. Generate 2D GD&T drawings and maintain the engineering BOM in PLM systems.	2+ years CAD, CATIA V5 expertise, understanding of aerospace materials (composites, Ti alloys).	f	f	Active	253	10	2c2c8c61-6b9e-4796-a416-00c1c0ef0499	2026-07-21 11:36:01.48648	\N	\N	\N	\N	\N	\N	year	f
3e774049-5aa7-49a4-889e-342de1f3b66f	JOB-9HB4OA	Lead Formulation Scientist	BioHealth Pharma	Ahmedabad	₹12,00,000 - ₹18,00,000 PA	\N	Full-time	Biotechnology & Pharmaceuticals	Develop oral solid-dosage formulations from pre-formulation through scale-up. Design DOE studies for process optimisation and author CMC sections of ANDA/NDA dossiers.	4+ years formulation R&D, M.Pharm, experience with granulation and coating processes.	t	t	Active	187	60	820661ac-2e0d-4ce6-849d-26f4d17fa857	2026-07-17 11:36:01.486513	\N	\N	\N	\N	\N	\N	year	f
eb645b0e-9309-415a-9fb4-9f3f6cdcfb27	JOB-CGCMMH	Clinical Trials Data Analyst	BioHealth Pharma	Ahmedabad	₹9,00,000 - ₹14,00,000 PA	\N	Full-time	Biotechnology & Pharmaceuticals	Perform statistical analyses for Phase II/III clinical trials using SAS and R. Generate TLFs (Tables, Listings, Figures) and support data-management activities.	2+ years biostatistics, SAS Base/Advanced certified, ICH-GCP knowledge.	f	t	Active	343	40	820661ac-2e0d-4ce6-849d-26f4d17fa857	2026-07-07 11:36:01.486546	\N	\N	\N	\N	\N	\N	year	f
92b3bf3c-da13-4770-8deb-993490606fbd	JOB-ZA5QF4	Pharma Regulatory Affairs Specialist	BioHealth Pharma	Ahmedabad	₹10,00,000 - ₹15,00,000 PA	\N	Full-time	Biotechnology & Pharmaceuticals	Prepare and file CDSCO and FDA regulatory submissions. Track post-approval commitments, manage variation applications, and liaise with regulatory agencies during queries.	3+ years regulatory affairs, knowledge of CTD/eCTD format, pharma background.	t	f	Active	162	79	820661ac-2e0d-4ce6-849d-26f4d17fa857	2026-07-26 11:36:01.486579	\N	\N	\N	\N	\N	\N	year	f
7ef23865-860d-4965-9b20-b5bf31017fc9	JOB-W7DPG2	Medical Safety & Pharmacovigilance Officer	BioHealth Pharma	Ahmedabad	₹8,00,000 - ₹12,00,000 PA	\N	Full-time	Biotechnology & Pharmaceuticals	Process ICSRs within regulatory timelines, author PSURs, and conduct signal-detection analyses. Maintain the safety database (Argus/ArisGlobal) and train CRO partners on AE reporting.	2+ years PV, MBBS/BDS/M.Pharm, familiarity with MedDRA coding.	f	f	Active	85	39	820661ac-2e0d-4ce6-849d-26f4d17fa857	2026-07-09 11:36:01.486614	\N	\N	\N	\N	\N	\N	year	f
510d032c-65d7-41a8-af53-1272570604eb	JOB-XXGFW4	Quality Control Lab Technician	BioHealth Pharma	Ahmedabad	₹5,00,000 - ₹8,00,000 PA	\N	Full-time	Biotechnology & Pharmaceuticals	Perform HPLC, dissolution, and Karl-Fischer analyses on finished dosage forms. Calibrate lab instruments, maintain logbooks per GLP standards, and flag OOS results promptly.	B.Sc./M.Sc. Chemistry, 1+ year QC lab, basic HPLC troubleshooting ability.	f	f	Active	236	12	820661ac-2e0d-4ce6-849d-26f4d17fa857	2026-07-13 11:36:01.486647	\N	\N	\N	\N	\N	\N	year	f
a28439c7-e8ff-4d1d-86b4-98bccebec100	JOB-ZHJZMS	test 4 	test emp	Bangalore	₹10L - ₹88L PA	\N	Full-time	Information Technology (IT)	test 4		t	t	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-05 11:46:09.60276	\N	\N	\N	\N	\N	\N	year	t
ae56248d-e4b2-45de-a105-6df34dda19f4	JOB-4J9S8G	DevOps Cloud Engineer	Apex Innovations	Bangalore	₹15,00,000 - ₹22,00,000 PA	1500000	Full-time	Information Technology (IT)	Architect and maintain multi-region AWS infrastructure. Automate deployments with Terraform, manage Kubernetes clusters, and implement cost-optimization strategi	4+ years in DevOps, hands-on with AWS/GCP, Kubernetes CKA preferred.	f	f	Active	0	0	f4f71950-1320-4b9d-b7cb-f3a23519e5d7	2026-07-24 11:36:01.48395	\N	\N	\N	\N	\N	\N	year	f
bd8bab89-8bb4-4ca5-b636-86cc65a3055c	JOB-RK5OQY	Healthcare Data Analyst	Healthify Systems	Chennai	₹7L - ₹11L PA	700000	Full-time	Information Technology (IT)	Analyze patient engagement data, build dashboards in Metabase/Looker, and generate weekly insights reports for the product and clinical affairs teams.	1+ year analytics, SQL proficiency, familiarity with healthcare KPIs.	f	f	Active	0	0	c0d732e2-e53b-4072-a079-8c706cb7abf3	2026-07-26 11:36:01.484723	\N	\N	\N	\N	7	11	year	f
8a6c1d0f-e5a9-4a3c-8cb0-a96cbf755c5e	JOB-F85OUV	test 1 	Test Employer	Bangalore	₹10L - ₹10L PA	1000000	Full-time	Information Technology (IT)	test 1		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-04 14:47:27.238765	\N	\N	\N	\N	10	10	year	f
107e5287-bda4-466f-a149-83aaf14d0134	JOB-WB7C0T	test 2 	Test Employer	Bangalore	₹10L - ₹12L PA	1000000	Full-time	Information Technology (IT)	test 2		t	f	Deleted	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-04 14:47:46.167967	\N	\N	\N	\N	10	12	year	f
adfa579f-114f-4bcc-8271-070d4443190f	JOB-J7OCHQ	test 3	Test Employer	Bangalore	₹1L - ₹20L PA	100000	Full-time	Information Technology (IT)	test 3		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-04 14:57:36.303678	\N	\N	\N	\N	1	20	year	f
f8574fb0-3622-4e23-aa00-46a21cbd9ba9	JOB-5YZ7E4	test 4	Test Employer	Bangalore	₹1L - ₹2L PA	100000	Full-time	Information Technology (IT)	test 4		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-04 14:59:48.605061	\N	\N	\N	\N	1	2	year	t
8b0a3c5e-f7ed-4106-9383-7eb0ff3867a0	JOB-L4HMZH	test 1	test emp	Bangalore	₹10L - ₹12L PA	1000000	Full-time	Information Technology (IT)	test 1 		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-05 11:43:29.55487	\N	\N	\N	\N	10	12	year	f
9fa6175f-9d7a-4318-840a-5a61a637b285	JOB-340S7I	test 2	test emp	Bangalore	₹15L - ₹16L PA	1500000	Full-time	Information Technology (IT)	test 2		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-05 11:43:52.960698	\N	\N	\N	\N	15	16	year	f
ed050b20-ba2e-413e-a753-7c622427593d	JOB-9UTBVW	test 3 	test emp	Bangalore	₹10,000 - ₹25,000 PM	120000	Full-time	Information Technology (IT)	test 3 		t	f	Active	0	0	b4e50a35-6424-4078-89d9-3bd9fae41866	2026-08-05 11:44:13.20599	\N	\N	\N	\N	10000	25000	month	f
\.


--
-- Data for Name: otp_verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_verifications (id, email, otp_code, purpose, expires_at, created_at) FROM stdin;
1f4c1029-f3b8-495e-9f33-2386f2c739ad	vikram@logiroute.com	110650	login	2026-08-10 14:33:59.779402	2026-08-10 14:23:59.790972
\.


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_transactions (id, employer_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, credits_purchased, status, created_at) FROM stdin;
23683d0b-3be4-4308-826d-ca0213c1049e	8ac8cbfe-234b-4c9c-9316-faf1e9df1049	order_mock_d5e4e3c5cbe244	pay_mock_vp4a65t1n	mock_signature_valid	699	10	Paid	2026-08-04 14:59:15.667431
aff357c5-ac57-45ff-bdde-7bb4de7cfc20	8ac8cbfe-234b-4c9c-9316-faf1e9df1049	order_mock_4ec45ac31c7747	\N	\N	699	10	Created	2026-08-04 15:06:36.605282
9c49571e-9d43-4d68-9e6c-9b6f9b7f4500	d21a3237-d46a-42ec-88f7-1c1503b389f7	order_mock_024b1585335c4f	\N	\N	399	5	Created	2026-08-05 11:45:33.461924
b97db4be-3eff-42b3-a981-265dc191755b	d21a3237-d46a-42ec-88f7-1c1503b389f7	order_mock_566dc5850daf47	pay_mock_uso405ujo	mock_signature_valid	399	5	Paid	2026-08-05 11:45:51.990427
\.


--
-- Data for Name: post_credits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.post_credits (id, employer_id, credits, created_at, updated_at) FROM stdin;
7e9b49f9-83c3-425f-bcee-4a3c28570e84	8ac8cbfe-234b-4c9c-9316-faf1e9df1049	9	2026-08-04 14:59:23.121695	2026-08-04 14:59:48.606025
abbd88c4-87d0-4a6a-a44e-df1cb9f533cd	d21a3237-d46a-42ec-88f7-1c1503b389f7	4	2026-08-05 11:45:53.934232	2026-08-05 11:46:09.60276
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, tagline, price, period, features) FROM stdin;
starter	Starter Business	Ideal for small businesses & quick local hiring	Free	Forever Free	Post up to 3 active job listings\nDirect candidate WhatsApp apply redirection\nBasic candidate click lead analytics\nStandard search placement\nCommunity email support
pro	Pro Employer	Best for fast-growing companies seeking top talent	₹1,999	per month	Unlimited active job postings\nUnlimited Direct WhatsApp candidate leads\nPriority Urgent & Featured title badges included\nTop search result placement\nCustom WhatsApp candidate apply templates\nReal-time candidate inquiry breakdown analytics\n24/7 Priority WhatsApp support
enterprise	Enterprise Growth	Comprehensive hiring solution for large teams	₹4,999	per month	Everything in Pro Employer plan\nVerified Gold Employer Badge\nDedicated hiring account manager\nMulti-user team workspace access\nCustom branding & logo highlights\nAutomated candidate follow-up broadcasts
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, full_name, role, created_at) FROM stdin;
9ae0925e-05e1-4369-a0f6-8c199337fab4	admin@jobportal.com	$2b$12$YPd75mR8XQTGSeZUc1etgeHenFXxFd6H0xPQS5.E1OleMYELvB1Z2	Platform Admin	SUPER_USER	2026-04-29 11:35:57.942837
3c5658de-209c-4430-84f8-24bd85e6f4e6	rajesh.agent@jobportal.com	$2b$12$.bDu1dj3ZBsdzgjGHQwfaeZ/i2x4VYgMWZBZMLnXH7CpmL75Y0Eoy	Rajesh Malhotra	AGENT	2026-05-29 11:35:58.180832
cb72accc-0be8-48c1-a85f-d3179143a593	priya.agent@jobportal.com	$2b$12$KKzJ2xkcqJpZqTZtWoQtg.51LGPLQv5hwjDQzcq.jGclJMDIBuSam	Priya Sharma	AGENT	2026-06-08 11:35:58.441908
d1821e5e-969c-4ea8-9754-e4cf9d257c91	amit@apexinnovations.com	$2b$12$RVBTqyV/vOA.Ck/2dpjFp.EYRRvRxXMUV9AVMzpdp0WTKNsEkwB3a	Amit Goel	EMPLOYER	2026-07-17 11:35:58.672792
a2b4635e-4b89-48d8-a2d2-43a04031c43b	rohan@quantumlabs.ai	$2b$12$flmF7ODyT.G2/twDDZAziOiHmnRLdti4rygpLPW72UR7gcQAqgKsm	Rohan Gupta	EMPLOYER	2026-06-20 11:35:58.912761
f2505b7b-22c1-4e34-b35b-95f9f01f68e8	kavita@fintechsolutions.in	$2b$12$hd5YdataSuNZ3wfIfNEAp.md3O8xijjDKJBx2pQhfyghMiJIkZjwm	Kavita Reddy	EMPLOYER	2026-06-19 11:35:59.142431
8f229567-2910-4dd3-be62-f71aff702a33	siddharth@cloudsphere.io	$2b$12$Xbn6nI/1RT67.0EiaF3UDeHvG.1q207k8gSkineznFRlLMWFtiMQy	Siddharth Sen	EMPLOYER	2026-07-03 11:35:59.381063
4aaebd29-6ef3-4740-bcbc-d2f6f8eb50f5	ananya@healthify.in	$2b$12$OzU8ZpPckohdW0mGvk9ik.6LfmLcbjwbulIcG7VZk469PEsaLA8oG	Ananya Roy	EMPLOYER	2026-07-16 11:35:59.615899
32a92394-7ae7-42a5-b4bc-8eda24a0fb64	vikram@logiroute.com	$2b$12$aNs4WNwLOrpc.vLiy4Vhr.Q9LtA1XXClPbBUcxbl7dYN0RDqg2sO2	Vikram Rathore	EMPLOYER	2026-07-16 11:35:59.862644
b517636b-efc9-4143-a0cb-0e3435634f49	meera@edulearn.co.in	$2b$12$LmiiYkDhA/GKbuHi3Mdp2.p1.vVhpRrzffwT02xRb83pKtfH8B1K.	Meera Joshi	EMPLOYER	2026-06-22 11:36:00.106614
2bc4ac06-93c2-4bba-927e-eccbd96edba0	deepak@solaris-energy.in	$2b$12$udOo3BRjaReITEX3X2hsMOEyQYUlT3G4AJ9YgvxFk14m27xB1Ng9u	Deepak Verma	EMPLOYER	2026-07-17 11:36:00.348264
5a951655-b7c1-4f52-a3f5-833836b23e25	ayesha@designcraft.studio	$2b$12$GzW0pYywwB9N5aEOfgNzEeqzPuaYF1257ThWe1eHTzpGip2h3VbB2	Ayesha Khan	EMPLOYER	2026-06-18 11:36:00.57914
4a6b386c-c1b8-40e8-9285-c0cd91b4baba	arjun@cybershield.io	$2b$12$6KZA/H.uDPquSEB3vdKwYuLdIb29vFl3DZnQRRWRXeLNN7NrsYVgS	Arjun Saxena	EMPLOYER	2026-06-16 11:36:00.821555
d823be5c-8aa8-4b69-9e5a-4229b42a4cf8	sneha@aerotech.co.in	$2b$12$UNWGwcsly51tk1a7gt720.kJVIXekNDmVNeE9OK4TDtvUPR5qt5Vu	Sneha Nair	EMPLOYER	2026-07-09 11:36:01.141497
d622fd70-76c3-44bb-a513-2e6c7abc7122	gaurav@biohealth.in	$2b$12$0elJD483jNZgkL7.nQZd5.mUlFjPC16kIpMtpwnZvBeQBluHyNnQm	Gaurav Malhotra	EMPLOYER	2026-06-17 11:36:01.482408
10e7b73a-9502-4be2-a6e2-23f00a4c84cc	praful101nayak@gmail.com	$2b$12$fYw8tx0FuM.qJOuZrgmbo.wP6A3AZn/hkSSbFyI1BAH4W6L232/Cu	Praful Nayak	AGENT	2026-07-31 11:42:01.472648
1ae36c8c-0b44-4615-8b49-0cc7ef535a69	vp@gmail.com	$2b$12$Ueh0t23hK4OnCPb6BKaY0u0nbcUspKqS/LMAlCWa9Thde6Dkiuaoa	Virendra Patil	EMPLOYER	2026-07-31 11:44:32.218377
2294aca1-9dd2-4a77-8d19-73d4120580c0	test@gmail.com	$2b$12$oXQbMg7A0QtXkbUkas9jDexf/sjkzFDla9ZGC7a1yR8VIDLVH4tHC	Test Employer	EMPLOYER	2026-08-04 14:39:04.213954
5cf0d6ff-cd5b-4d7f-a66d-11548768c9e5	test@emp.com	$2b$12$Znd1KQp2Y8szRGR491Fln.MVhvnp1Q/DpEqM592ittcEtZKE/ah2O	test emp	EMPLOYER	2026-08-05 11:42:03.64914
812d19d0-8007-4557-ac46-ed38475e19c0	testemployer@startup.in	$2b$12$hVJVPoSJqvNSZqKqGpxwyu1vqDoAYvmzcBSkprKwbsUCNEMO46Oei	Test Employer	EMPLOYER	2026-08-10 14:25:55.69673
\.


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: agent_profiles agent_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_profiles
    ADD CONSTRAINT agent_profiles_pkey PRIMARY KEY (id);


--
-- Name: employer_profiles employer_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employer_profiles
    ADD CONSTRAINT employer_profiles_pkey PRIMARY KEY (id);


--
-- Name: job_categories job_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_categories
    ADD CONSTRAINT job_categories_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: otp_verifications otp_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verifications
    ADD CONSTRAINT otp_verifications_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: post_credits post_credits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_credits
    ADD CONSTRAINT post_credits_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_activity_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_action ON public.activity_logs USING btree (action);


--
-- Name: ix_activity_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_created_at ON public.activity_logs USING btree (created_at);


--
-- Name: ix_activity_logs_entity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_entity_id ON public.activity_logs USING btree (entity_id);


--
-- Name: ix_activity_logs_entity_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_entity_type ON public.activity_logs USING btree (entity_type);


--
-- Name: ix_activity_logs_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_id ON public.activity_logs USING btree (id);


--
-- Name: ix_activity_logs_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_user_email ON public.activity_logs USING btree (user_email);


--
-- Name: ix_activity_logs_user_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_user_role ON public.activity_logs USING btree (user_role);


--
-- Name: ix_agent_profiles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_agent_profiles_id ON public.agent_profiles USING btree (id);


--
-- Name: ix_agent_profiles_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_agent_profiles_referral_code ON public.agent_profiles USING btree (referral_code);


--
-- Name: ix_employer_profiles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_employer_profiles_id ON public.employer_profiles USING btree (id);


--
-- Name: ix_job_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_categories_id ON public.job_categories USING btree (id);


--
-- Name: ix_job_categories_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_job_categories_name ON public.job_categories USING btree (name);


--
-- Name: ix_job_postings_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_postings_category ON public.job_postings USING btree (category);


--
-- Name: ix_job_postings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_postings_id ON public.job_postings USING btree (id);


--
-- Name: ix_job_postings_reference_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_job_postings_reference_number ON public.job_postings USING btree (reference_number);


--
-- Name: ix_job_postings_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_postings_title ON public.job_postings USING btree (title);


--
-- Name: ix_otp_verifications_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_otp_verifications_email ON public.otp_verifications USING btree (email);


--
-- Name: ix_otp_verifications_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_otp_verifications_id ON public.otp_verifications USING btree (id);


--
-- Name: ix_payment_transactions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_payment_transactions_id ON public.payment_transactions USING btree (id);


--
-- Name: ix_payment_transactions_razorpay_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_payment_transactions_razorpay_order_id ON public.payment_transactions USING btree (razorpay_order_id);


--
-- Name: ix_payment_transactions_razorpay_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_payment_transactions_razorpay_payment_id ON public.payment_transactions USING btree (razorpay_payment_id);


--
-- Name: ix_post_credits_employer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_post_credits_employer_id ON public.post_credits USING btree (employer_id);


--
-- Name: ix_post_credits_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_post_credits_id ON public.post_credits USING btree (id);


--
-- Name: ix_subscription_plans_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_subscription_plans_id ON public.subscription_plans USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: agent_profiles agent_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_profiles
    ADD CONSTRAINT agent_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: employer_profiles employer_profiles_referred_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employer_profiles
    ADD CONSTRAINT employer_profiles_referred_by_id_fkey FOREIGN KEY (referred_by_id) REFERENCES public.agent_profiles(id);


--
-- Name: employer_profiles employer_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employer_profiles
    ADD CONSTRAINT employer_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: job_postings job_postings_employer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employer_profiles(id);


--
-- Name: payment_transactions payment_transactions_employer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employer_profiles(id) ON DELETE SET NULL;


--
-- Name: post_credits post_credits_employer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_credits
    ADD CONSTRAINT post_credits_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employer_profiles(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8gh8Kqgh0riQL5TAvYb0GFwqITQsBeGqxAFmAkgPB1QwY3h9XJcGWqvZCtPTqhv

